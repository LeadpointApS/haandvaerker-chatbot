'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Calculator, Camera, CheckCircle2, Loader2, Sparkles, Upload, Wrench } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { OptionGrid } from './OptionGrid';
import { TaskGrid } from './TaskGrid';
import { SummaryPanel } from '@/components/summary/SummaryPanel';
import { getConversationPlan } from '@/lib/conversation';
import { getAddressSuggestions } from '@/lib/address';
import { calculateEstimate, estimateLeadScore, money } from '@/lib/pricing';
import { FormState, Message, Settings, SummaryEntry, UploadedImage } from '@/lib/types';
import { TASKS, INITIAL_FORM } from '@/lib/config';

export function ChatWindow({ form, setForm, settings }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; settings: Settings }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'intro1', role: 'bot', content: 'Hej 👋 Jeg hjælper dig med at få et hurtigt prisestimat på din VVS-opgave.' },
    { id: 'intro2', role: 'bot', content: 'Vælg først den kategori, der passer bedst.' }
  ]);
  const [summaryLog, setSummaryLog] = useState<SummaryEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [complete, setComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plan = useMemo(() => getConversationPlan(form), [form]);
  const answeredCount = plan.filter((item) => {
    const v = form[item.key];
    return Array.isArray(v) ? v.length > 0 || form.imagesSkipped : Boolean(v);
  }).length;
  const progress = plan.length ? Math.max(8, (answeredCount / plan.length) * 100) : 8;

  const currentQuestion =
    plan.find((item) => {
      const value = form[item.key];
      if (item.key === 'images') return !(form.images.length > 0 || form.imagesSkipped);
      return item.optional ? false : Array.isArray(value) ? value.length === 0 : !value;
    }) ?? plan.find((item) => item.optional && !form[item.key]);

  const result = useMemo(() => calculateEstimate(form, settings), [form, settings]);
  const lead = useMemo(() => estimateLeadScore(form, result.manual), [form, result.manual]);
  const addressSuggestions = useMemo(() => (currentQuestion?.type === 'address' ? getAddressSuggestions(inputValue) : []), [currentQuestion, inputValue]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentQuestion, complete, sendStatus]);

  useEffect(() => {
    if (!form.task) return;
    const latestBot = messages.filter((m) => m.role === 'bot').at(-1)?.content ?? '';
    if (currentQuestion && !complete && !latestBot.includes(currentQuestion.label ?? '')) {
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, role: 'bot', content: currentQuestion.label ?? '' }]);
    }
    if (!currentQuestion && !complete) {
      setComplete(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now() + 1}`,
          role: 'bot',
          content: result.manual
            ? "Tak — din opgave kræver manuel vurdering. Du kan sende forespørgslen videre til VVS-firmaet nedenfor."
            : `Tak — dit vejledende prisestimat er ${money(result.min)} – ${money(result.max)}. Når du er klar, kan du sende forespørgslen videre nedenfor.`
        }
      ]);
    }
  }, [form.task, currentQuestion, complete, messages, result.manual, result.min, result.max]);

  function appendSummary(question: string, answer: string) {
    setSummaryLog((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, question, answer }]);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function answerCurrent(value: string | UploadedImage[], display?: string) {
    if (!currentQuestion) return;
    const answer = display ?? (Array.isArray(value) ? `${value.length} billede(r)` : value);
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content: answer }]);
    appendSummary(currentQuestion.label ?? 'Valg', answer);
    if (currentQuestion.key === 'images') {
      setField('images', Array.isArray(value) ? value : []);
      setField('imagesSkipped', Array.isArray(value) ? value.length === 0 : true);
      return;
    }
    setField(currentQuestion.key, value as never);
  }

  function submitTextInput() {
    if (!currentQuestion || !inputValue.trim()) return;
    answerCurrent(inputValue.trim(), inputValue.trim());
    setInputValue('');
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && currentQuestion?.type !== 'textarea') {
      e.preventDefault();
      submitTextInput();
    }
    if (e.key === 'Enter' && e.metaKey && currentQuestion?.type === 'textarea') {
      e.preventDefault();
      submitTextInput();
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const mapped = files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...mapped], imagesSkipped: false }));
  }

  async function sendLead() {
    setSendStatus(null);
    if (!settings.businessEmail) {
      setSendStatus('Virksomhedens mail er ikke sat i /admin endnu.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings,
          form,
          estimate: result,
          summaryLog
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kunne ikke sende forespørgslen.');
      setSendStatus(`Forespørgslen er sendt til ${settings.businessEmail}.`);
      setMessages((prev) => [...prev, { id: `bot-sent-${Date.now()}`, role: 'bot', content: `Perfekt — forespørgslen er sendt videre til ${settings.companyName}.` }]);
    } catch (error) {
      setSendStatus(error instanceof Error ? error.message : 'Kunne ikke sende forespørgslen.');
    } finally {
      setIsSending(false);
    }
  }

  function resetFlow() {
    setForm(INITIAL_FORM);
    setMessages([
      { id: 'intro1', role: 'bot', content: 'Hej 👋 Jeg hjælper dig med at få et hurtigt prisestimat på din VVS-opgave.' },
      { id: 'intro2', role: 'bot', content: 'Vælg først den kategori, der passer bedst.' }
    ]);
    setSummaryLog([]);
    setInputValue('');
    setComplete(false);
    setSendStatus(null);
  }

  return (
    <div className="grid h-[calc(100vh-170px)] gap-6 xl:grid-cols-[1.12fr_0.88fr]">
      <div className="flex h-full overflow-hidden rounded-[32px] border border-slate-200 bg-white/85 shadow-soft backdrop-blur">
        <div className="flex w-full flex-col">
          <div className="border-b border-slate-200/80 px-5 py-4 md:px-7 md:py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: settings.accentDeep }}>
                  <Sparkles className="h-4 w-4" /> Intelligent VVS-assistent
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Få et prisestimat i chatformat</h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-600 md:text-base">Ét spørgsmål ad gangen. Hurtigere for kunden og mere premium for virksomheden.</p>
              </div>
              <div className="hidden rounded-2xl p-3 md:block" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>
                <Wrench className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 md:text-sm">
                <span>Fremdrift</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: settings.accent }} />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatBubble key={message.id} role={message.role} settings={settings}>{message.content}</ChatBubble>
              ))}

              {!form.task && <TaskGrid tasks={TASKS} onSelect={(value) => answerCurrent(value)} settings={settings} />}

              {currentQuestion?.type === 'options' && currentQuestion.options && (
                <OptionGrid options={currentQuestion.options} onSelect={(value) => answerCurrent(value)} />
              )}

              {(currentQuestion?.type === 'input' || currentQuestion?.type === 'textarea' || currentQuestion?.type === 'address') && (
                <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                  {currentQuestion.type === 'textarea' ? (
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={onInputKeyDown}
                      placeholder={currentQuestion.placeholder || 'Skriv dit svar her'}
                      className="min-h-[120px] w-full rounded-2xl border-0 p-3 outline-none"
                    />
                  ) : (
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={onInputKeyDown}
                      placeholder={currentQuestion.placeholder || 'Skriv dit svar her'}
                      className="h-12 w-full rounded-2xl border-0 px-3 outline-none"
                    />
                  )}

                  {currentQuestion.type === 'address' && addressSuggestions.length > 0 && (
                    <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                      <div className="px-2 text-xs text-slate-500">Autosuggest demo. Til rigtig Google Places indsættes API-nøglen i dashboardet.</div>
                      {addressSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            answerCurrent(suggestion, suggestion);
                            setInputValue('');
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-white"
                        >
                          <span>{suggestion}</span>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button type="button" onClick={submitTextInput} className="rounded-2xl px-5 py-3 text-sm text-white" style={{ backgroundColor: settings.accent }}>
                      Send svar
                    </button>
                  </div>
                </div>
              )}

              {currentQuestion?.type === 'images' && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl p-2" style={{ backgroundColor: settings.accentSoft, color: settings.accentDeep }}>
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">Upload billeder af opgaven</div>
                      <div className="mt-1 text-sm text-slate-600">Det er valgfrit, men giver ofte et bedre estimat og en bedre opsummering til håndværkeren.</div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button type="button" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 inline h-4 w-4" /> Vælg billeder
                        </button>
                        <button type="button" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" onClick={() => answerCurrent([], 'Spring over billeder')}>
                          Spring over
                        </button>
                        <button type="button" className="rounded-2xl px-4 py-3 text-sm text-white" style={{ backgroundColor: settings.accent }} onClick={() => answerCurrent(form.images, form.images.length ? `${form.images.length} billede(r) uploadet` : 'Ingen billeder uploadet')}>
                          Fortsæt
                        </button>
                      </div>
                      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={onUpload} />
                      {form.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-4">
                          {form.images.map((img) => (
                            <div key={img.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                              <img src={img.url} alt={img.name} className="h-20 w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {complete && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                  {!result.manual ? (
                    <div className="rounded-[28px] p-5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${settings.accentDeep}, ${settings.accent})` }}>
                      <div className="flex items-center gap-2 text-sm text-white/80"><Calculator className="h-4 w-4" /> Vejledende prisestimat</div>
                      <div className="mt-2 text-3xl font-semibold md:text-4xl">{money(result.min)} – {money(result.max)}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {result.included.map((item) => (
                          <span key={item} className="rounded-full bg-white/15 px-3 py-1 text-sm text-white">{item}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-amber-950">
                      <div className="flex items-center gap-2 text-sm font-medium"><AlertTriangle className="h-4 w-4" /> Manuel vurdering</div>
                      <div className="mt-2 text-lg font-semibold">Denne opgave bør vurderes manuelt af en VVS'er.</div>
                    </div>
                  )}

                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">Klar til at sende forespørgslen?</div>
                        <div className="text-sm text-slate-500">Når kunden trykker her, sendes opsummeringen automatisk til virksomhedens mail.</div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button type="button" disabled={isSending} onClick={sendLead} className="rounded-2xl px-4 py-3 text-sm text-white disabled:opacity-60" style={{ backgroundColor: settings.accent }}>
                          {isSending ? <><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Sender...</> : <><CheckCircle2 className="mr-2 inline h-4 w-4" /> Send forespørgsel</>}
                        </button>
                        <button type="button" onClick={resetFlow} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                          Start forfra
                        </button>
                      </div>
                    </div>
                    {sendStatus && <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{sendStatus}</div>}
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>
          </div>
        </div>
      </div>

      <SummaryPanel settings={settings} summaryLog={summaryLog} lead={lead} result={result}  images={form.images} complete={complete} />
    </div>
  );
}
