import React, { useEffect, useMemo, useRef, useState } from "react";
import { getProjectConfig, projectList } from "../configs/projects/index.js";
import { budgetOptions, timelineOptions } from "../configs/shared.js";
import { RUNTIME_CONFIG } from "../configs/runtime.js";
import { buildSteps } from "../engine/flowEngine.js";
import { calculateEstimate, getEstimateFeedback } from "../engine/estimateEngine.js";
import { buildTranscript } from "../engine/messageBuilder.js";
import { sendLeadWebhook } from "../services/webhookService.js";
import { createLeadId, formatDkk, formatRange } from "../utils/format.js";

function ChatBubble({ role, children }) {
  return (
    <div className={`bubble-row ${role === "bot" ? "bot" : "user"}`}>
      <div className={`bubble ${role}`}>{children}</div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="bubble-row bot">
      <div className="bubble bot typing-bubble">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}

function ChoiceButton({ active, title, meta, onClick }) {
  return (
    <button className={`choice-button ${active ? "active" : ""}`} onClick={onClick} type="button">
      <div className="choice-title">{title}</div>
      {meta ? <div className="choice-meta">{meta}</div> : null}
    </button>
  );
}

function ImageChoiceCard({ option, active, onClick }) {
  return (
    <button className={`image-choice ${active ? "active" : ""}`} onClick={onClick} type="button">
      <img src={option.image} alt={option.label} />
      <div className="image-overlay">
        <div className="image-choice-title">{option.label}</div>
        <div className="image-choice-desc">{option.description}</div>
        <div className="image-choice-meta">{formatRange(option.priceRange)}</div>
      </div>
    </button>
  );
}

function ProjectCard({ option, active, onClick }) {
  return (
    <button className={`project-card ${active ? "active" : ""}`} onClick={onClick} type="button">
      <div className="project-card-title">{option.label}</div>
      <div className="project-card-desc">{option.description}</div>
    </button>
  );
}

function FilePreview({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className="file-grid">
      {files.map((file, index) => (
        <div className="file-card" key={`${file.name}-${index}`}>
          <img src={file.preview} alt={file.name} />
          <button type="button" onClick={() => onRemove(index)}>×</button>
        </div>
      ))}
    </div>
  );
}

export function ChatApp() {
  const [answers, setAnswers] = useState({
    projectType: RUNTIME_CONFIG.DEFAULT_PROJECT_KEY,
    category: "",
    size: "",
    details: "",
    photos: [],
    elements: {},
    budget: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [draft, setDraft] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const scrollRef = useRef(null);

  const project = getProjectConfig(answers.projectType);
  const steps = useMemo(() => buildSteps(project), [project]);
  const currentStep = steps[stepIndex];
  const transcript = useMemo(() => buildTranscript(project, answers, RUNTIME_CONFIG.APP_NAME), [project, answers]);
  const estimate = useMemo(() => calculateEstimate(project, answers), [project, answers]);
  const feedback = useMemo(() => getEstimateFeedback(project, estimate), [project, estimate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, currentStep, isTyping, submitState]);

  useEffect(() => {
    return () => {
      answers.photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [answers.photos]);

  function withDelay(callback) {
    if (callback) callback();
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 450);
  }

  function setProject(projectKey) {
    setAnswers((prev) => ({
      ...prev,
      projectType: projectKey,
      category: "",
      size: "",
      details: "",
      photos: prev.photos,
      elements: {},
      budget: "",
      timeline: "",
      name: "",
      email: "",
      phone: "",
      address: "",
    }));
  }

  function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const prepared = files.slice(0, RUNTIME_CONFIG.MAX_UPLOADS).map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setAnswers((prev) => ({
      ...prev,
      photos: [...prev.photos, ...prepared].slice(0, RUNTIME_CONFIG.MAX_UPLOADS),
    }));
    event.target.value = "";
  }

  function removePhoto(index) {
    setAnswers((prev) => {
      const photo = prev.photos[index];
      if (photo) URL.revokeObjectURL(photo.preview);
      return {
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      };
    });
  }

  async function submitLead() {
    const payload = {
      leadId: createLeadId(),
      submittedAt: new Date().toISOString(),
      projectType: answers.projectType,
      projectLabel: project.label,
      answers: {
        ...answers,
        photos: answers.photos.map((photo) => ({
          name: photo.name,
        })),
      },
      estimate,
      feedback,
    };

    setSubmitState({ status: "sending", message: "Sender..." });
    const result = await sendLeadWebhook(payload);

    if (result.ok) {
      setSubmitState({ status: "success", message: "Lead sendt via webhook." });
    } else {
      setSubmitState({
        status: "error",
        message: result.message || result.error || "Webhook kunne ikke sendes.",
      });
    }
  }

  function saveDraftToCurrentField(field) {
    const value = draft.trim();
    if (!value) return;
    withDelay(() => {
      setAnswers((prev) => ({ ...prev, [field]: value }));
      setDraft("");
    });
  }

  function renderComposer() {
    if (currentStep === "welcome") {
      return (
        <div className="composer-panel">
          <button className="primary-button" type="button" onClick={() => withDelay()}>
            Lad os gå i gang
          </button>
        </div>
      );
    }

    if (currentStep === "project") {
      return (
        <div className="composer-panel project-grid">
          {projectList.map((item) => (
            <ProjectCard
              key={item.key}
              option={item}
              active={answers.projectType === item.key}
              onClick={() =>
                withDelay(() => {
                  setProject(item.key);
                })
              }
            />
          ))}
        </div>
      );
    }

    if (currentStep === "category") {
      return (
        <div className="composer-panel">
          <div className="image-grid">
            {project.categoryOptions.map((option) => (
              <ImageChoiceCard
                key={option.key}
                option={option}
                active={answers.category === option.key}
                onClick={() => withDelay(() => setAnswers((prev) => ({ ...prev, category: option.key })))}
              />
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === "size") {
      return (
        <div className="composer-panel choices-wrap">
          {project.sizeOptions.map((option) => (
            <ChoiceButton
              key={option.key}
              active={answers.size === option.key}
              title={option.label}
              meta={formatRange(option.priceRange)}
              onClick={() => withDelay(() => setAnswers((prev) => ({ ...prev, size: option.key })))}
            />
          ))}
        </div>
      );
    }

    if (currentStep === "details") {
      return (
        <div className="composer-panel">
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={project.detailPlaceholder}
            className="text-input textarea"
          />
          <div className="composer-actions">
            <button className="primary-button" type="button" onClick={() => saveDraftToCurrentField("details")}>
              Send svar
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === "photos") {
      return (
        <div className="composer-panel">
          <label className="upload-box">
            <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhotoUpload} />
            Upload billeder
          </label>
          <div className="micro-copy">På mobil kan kameraet åbne direkte. Du kan uploade op til {RUNTIME_CONFIG.MAX_UPLOADS} billeder.</div>
          <FilePreview files={answers.photos} onRemove={removePhoto} />
          <div className="composer-actions">
            <button className="secondary-button" type="button" onClick={() => withDelay()}>
              Spring over
            </button>
            <button className="primary-button" type="button" onClick={() => withDelay()}>
              Fortsæt
            </button>
          </div>
        </div>
      );
    }

    if (currentStep.startsWith("group:")) {
      const key = currentStep.split(":")[1];
      const group = project.elementGroups.find((item) => item.key === key);
      if (!group) return null;

      return (
        <div className="composer-panel">
          <div className="micro-copy">{group.helperText}</div>
          <div className="choices-wrap">
            {group.options.map((option) => (
              <ChoiceButton
                key={option.key}
                active={answers.elements[key] === option.key}
                title={option.label}
                meta={formatRange(option.priceRange)}
                onClick={() =>
                  withDelay(() =>
                    setAnswers((prev) => ({
                      ...prev,
                      elements: {
                        ...prev.elements,
                        [key]: option.key,
                      },
                    }))
                  )
                }
              />
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === "budget") {
      return (
        <div className="composer-panel choices-wrap">
          {budgetOptions.map((option) => (
            <ChoiceButton
              key={option.key}
              active={answers.budget === option.key}
              title={option.label}
              onClick={() => withDelay(() => setAnswers((prev) => ({ ...prev, budget: option.key })))}
            />
          ))}
        </div>
      );
    }

    if (currentStep === "timeline") {
      return (
        <div className="composer-panel choices-wrap">
          {timelineOptions.map((option) => (
            <ChoiceButton
              key={option.key}
              active={answers.timeline === option.key}
              title={option.label}
              onClick={() => withDelay(() => setAnswers((prev) => ({ ...prev, timeline: option.key })))}
            />
          ))}
        </div>
      );
    }

    if (currentStep === "contact_name") {
      return (
        <div className="composer-panel">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Fulde navn" className="text-input" />
          <div className="composer-actions">
            <button className="primary-button" type="button" onClick={() => saveDraftToCurrentField("name")}>Gem navn</button>
          </div>
        </div>
      );
    }

    if (currentStep === "contact_email") {
      return (
        <div className="composer-panel">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="E-mail" className="text-input" inputMode="email" />
          <div className="composer-actions">
            <button className="primary-button" type="button" onClick={() => saveDraftToCurrentField("email")}>Gem e-mail</button>
          </div>
        </div>
      );
    }

    if (currentStep === "contact_phone") {
      return (
        <div className="composer-panel">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Telefonnummer" className="text-input" inputMode="tel" />
          <div className="composer-actions">
            <button className="primary-button" type="button" onClick={() => saveDraftToCurrentField("phone")}>Gem telefon</button>
          </div>
        </div>
      );
    }

    if (currentStep === "contact_address") {
      return (
        <div className="composer-panel">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Adresse" className="text-input" />
          <div className="composer-actions">
            <button className="primary-button" type="button" onClick={() => saveDraftToCurrentField("address")}>Gem adresse</button>
          </div>
        </div>
      );
    }

    if (currentStep === "summary") {
      return (
        <div className="summary-card">
          <div className="summary-eyebrow">Vejledende prisinterval</div>
          <div className="summary-price">{formatDkk(estimate.low)} - {formatDkk(estimate.high)}</div>
          <div className="summary-feedback">{feedback}</div>

          <div className="summary-section">
            <strong>Kontakt</strong>
            <div>{answers.name || "Intet navn"}</div>
            <div>{answers.email || "Ingen e-mail"}</div>
            <div>{answers.phone || "Intet telefonnummer"}</div>
            <div>{answers.address || "Ingen adresse"}</div>
          </div>

          <div className="summary-section">
            <strong>Projekt</strong>
            <div>{project.label}</div>
            <div>{project.categoryOptions.find((item) => item.key === answers.category)?.label || "Ikke valgt"}</div>
            <div>{project.sizeOptions.find((item) => item.key === answers.size)?.label || "Ikke valgt"}</div>
          </div>

          <div className="summary-section">
            <strong>Webhook</strong>
            <div className="micro-copy">
              {RUNTIME_CONFIG.WEBHOOK_URL ? "Webhook er sat og klar." : "Webhook URL mangler i src/configs/runtime.js"}
            </div>
          </div>

          <div className="composer-actions">
            <button className="primary-button" type="button" onClick={submitLead} disabled={submitState.status === "sending"}>
              {submitState.status === "sending" ? "Sender..." : "Send lead"}
            </button>
          </div>

          {submitState.message ? <div className={`submit-state ${submitState.status}`}>{submitState.message}</div> : null}
        </div>
      );
    }

    return null;
  }

  return (
    <main className="app-shell">
      <section className="chat-shell">
        <header className="chat-header">
          <div className="chat-header-eyebrow">Leadpoint Chatbot</div>
          <h1>{RUNTIME_CONFIG.APP_NAME}</h1>
          <div className="chat-header-subtitle">Fullscreen chat, mobilvenlig og klar til webhook.</div>
        </header>

        <div className="chat-scroll" ref={scrollRef}>
          {transcript.filter((item) => item.show).map((item) => (
            <ChatBubble key={item.key} role={item.role}>
              {item.content}
            </ChatBubble>
          ))}

          {isTyping ? <TypingBubble /> : null}

          {!isTyping && currentStep !== "summary" ? (
            <div className="bubble-row bot">
              <div className="bubble bot composer-bubble">{renderComposer()}</div>
            </div>
          ) : null}

          {!isTyping && currentStep === "summary" ? (
            <div className="bubble-row bot">
              <div className="bubble bot composer-bubble">{renderComposer()}</div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
