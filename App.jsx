import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bath,
  Sofa,
  Droplets,
  Phone,
  CheckCircle2,
  ArrowRight,
  Wand2,
  Upload,
  Image as ImageIcon,
  Ruler,
  ChefHat,
  CookingPot,
  PanelsTopLeft,
  Refrigerator,
  Home,
} from "lucide-react";

const BOT_NAME = "Boble";
const STEP_DELAY = 520;

const sharedStyles = [
  {
    key: "modern",
    label: "Moderne",
    desc: "Rene linjer, rolige farver og et stramt look",
    factor: 1.12,
    priceRange: [15000, 45000],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    key: "classic",
    label: "Klassisk",
    desc: "Tidløst, funktionelt og sikkert valg",
    factor: 1,
    priceRange: [10000, 30000],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    key: "spa",
    label: "Spa",
    desc: "Luksus, varme toner og hotelstemning",
    factor: 1.24,
    priceRange: [25000, 70000],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    key: "budget",
    label: "Prisvenlig",
    desc: "Fornuftige valg med fokus på økonomi",
    factor: 0.9,
    priceRange: [0, 15000],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];

const sharedBudgetOptions = [
  { key: "low", label: "Under 120.000 kr.", factor: 0.9 },
  { key: "mid", label: "120.000 - 200.000 kr.", factor: 1 },
  { key: "high", label: "200.000 - 300.000 kr.", factor: 1.12 },
  { key: "premium", label: "300.000+ kr.", factor: 1.24 },
];

const sharedTimelineOptions = [
  { key: "asap", label: "Så hurtigt som muligt" },
  { key: "soon", label: "Inden for 1-3 måneder" },
  { key: "later", label: "Senere på året" },
  { key: "research", label: "Jeg undersøger stadig" },
];

const PROJECTS = {
  bathroom: {
    key: "bathroom",
    label: "Badeværelse",
    desc: "Nyt badeværelse eller renovering af eksisterende bad",
    icon: Bath,
    noun: "badeværelse",
    nounDefinite: "badeværelset",
    detailsPlaceholder:
      "Fx: Jeg vil have totalrenoveret badeværelset, flyttet bruseren, lavet niche i væggen, gulvvarme og et væghængt toilet...",
    estimateBase: { low: 70000, high: 105000 },
    feedback: {
      high: "Det her ligner et større badeværelsesprojekt med flere valg i den dyre ende.",
      mid: "Det her ligger i et solidt mellemleje, hvor mange komplette badeværelsesprojekter ender.",
      low: "Det her ligner en mere prisbevidst løsning med fokus på de vigtigste valg først.",
      midThreshold: 190000,
      highThreshold: 320000,
    },
    sizeOptions: [
      { key: "xs", label: "2-4 m²", factor: 0.85, priceRange: [0, 20000] },
      { key: "sm", label: "4-6 m²", factor: 1, priceRange: [15000, 35000] },
      { key: "md", label: "6-9 m²", factor: 1.18, priceRange: [30000, 55000] },
      { key: "lg", label: "9-12 m²", factor: 1.34, priceRange: [50000, 90000] },
    ],
    elementGroups: [
      {
        key: "armatur",
        label: "Armaturer",
        icon: Droplets,
        options: [
          { key: "basic", label: "Standard", priceRange: [4000, 9000] },
          { key: "mid", label: "Mellemklasse", priceRange: [9000, 17000] },
          { key: "premium", label: "Design", priceRange: [17000, 30000] },
        ],
      },
      {
        key: "furniture",
        label: "Møbler",
        icon: Sofa,
        options: [
          { key: "basic", label: "Enkelt møbel", priceRange: [6000, 12000] },
          { key: "mid", label: "God kvalitet", priceRange: [12000, 22000] },
          { key: "premium", label: "Eksklusivt møbel", priceRange: [22000, 38000] },
        ],
      },
      {
        key: "shower",
        label: "Bruseløsning",
        icon: Bath,
        options: [
          { key: "basic", label: "Standard løsning", priceRange: [7000, 14000] },
          { key: "mid", label: "Rain shower", priceRange: [14000, 24000] },
          { key: "premium", label: "Eksklusiv løsning", priceRange: [24000, 42000] },
        ],
      },
      {
        key: "tiles",
        label: "Fliser og overflader",
        icon: Sparkles,
        options: [
          { key: "basic", label: "Standard", priceRange: [15000, 28000] },
          { key: "mid", label: "Pæn mellemklasse", priceRange: [28000, 42000] },
          { key: "premium", label: "Store / designfliser", priceRange: [42000, 70000] },
        ],
      },
    ],
  },
  kitchen: {
    key: "kitchen",
    label: "Køkken",
    desc: "Nyt køkken eller renovering af eksisterende køkken",
    icon: ChefHat,
    noun: "køkken",
    nounDefinite: "køkkenet",
    detailsPlaceholder:
      "Fx: Jeg vil have nyt køkken med køkkenø, nye hvidevarer, ny bordplade, ændret layout og bedre opbevaring...",
    estimateBase: { low: 90000, high: 140000 },
    feedback: {
      high: "Det her ligner et større køkkenprojekt med flere valg i den dyre ende.",
      mid: "Det her ligger i et solidt mellemleje, hvor mange komplette køkkenprojekter ender.",
      low: "Det her ligner en mere prisbevidst køkkenløsning med fokus på de vigtigste valg først.",
      midThreshold: 200000,
      highThreshold: 350000,
    },
    sizeOptions: [
      { key: "xs", label: "5-8 m²", factor: 0.88, priceRange: [0, 25000] },
      { key: "sm", label: "8-12 m²", factor: 1, priceRange: [20000, 45000] },
      { key: "md", label: "12-18 m²", factor: 1.18, priceRange: [40000, 80000] },
      { key: "lg", label: "18+ m²", factor: 1.34, priceRange: [70000, 130000] },
    ],
    elementGroups: [
      {
        key: "cabinets",
        label: "Køkkenelementer",
        icon: PanelsTopLeft,
        options: [
          { key: "basic", label: "Standard", priceRange: [25000, 50000] },
          { key: "mid", label: "Mellemklasse", priceRange: [50000, 90000] },
          { key: "premium", label: "Special / design", priceRange: [90000, 160000] },
        ],
      },
      {
        key: "countertop",
        label: "Bordplade",
        icon: Home,
        options: [
          { key: "basic", label: "Laminat", priceRange: [5000, 15000] },
          { key: "mid", label: "Komposit / træ", priceRange: [15000, 35000] },
          { key: "premium", label: "Sten / eksklusiv", priceRange: [35000, 70000] },
        ],
      },
      {
        key: "appliances",
        label: "Hvidevarer",
        icon: Refrigerator,
        options: [
          { key: "basic", label: "Basispakke", priceRange: [15000, 30000] },
          { key: "mid", label: "God kvalitet", priceRange: [30000, 60000] },
          { key: "premium", label: "Premium pakke", priceRange: [60000, 120000] },
        ],
      },
      {
        key: "sink",
        label: "Vask og armatur",
        icon: CookingPot,
        options: [
          { key: "basic", label: "Standard", priceRange: [4000, 9000] },
          { key: "mid", label: "Mellemklasse", priceRange: [9000, 18000] },
          { key: "premium", label: "Design", priceRange: [18000, 35000] },
        ],
      },
      {
        key: "backsplash",
        label: "Væg / stænkzone",
        icon: Sparkles,
        options: [
          { key: "basic", label: "Maling / enkel løsning", priceRange: [3000, 8000] },
          { key: "mid", label: "Fliser / pæn finish", priceRange: [8000, 18000] },
          { key: "premium", label: "Designfinish", priceRange: [18000, 35000] },
        ],
      },
    ],
  },
};

function Card({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = "", variant = "default", children, ...props }) {
  const variantClass =
    variant === "outline"
      ? "border border-stone-300 bg-white text-zinc-800 hover:bg-stone-50"
      : "bg-sky-600 text-white hover:bg-sky-700 border border-transparent";

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200 ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200 ${className}`}
    />
  );
}

function Badge({ className = "", children }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${className}`}>{children}</span>
  );
}

function formatDkk(value) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRange(range) {
  return `${formatDkk(range[0])} - ${formatDkk(range[1])}`;
}

function ChatBubble({ role, children }) {
  const isBot = role === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[75%] ${
          isBot
            ? "border border-stone-200 bg-white text-zinc-800"
            : "bg-gradient-to-r from-teal-500 to-sky-500 text-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
        </div>
      </div>
    </div>
  );
}

function ImageChoiceCard({ option, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`overflow-hidden rounded-[22px] border text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
        active ? "border-sky-400 ring-2 ring-sky-200" : "border-stone-200 bg-white"
      }`}
    >
      <div className="relative h-36 w-full overflow-hidden">
        <img src={option.image} alt={option.label} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="font-semibold">{option.label}</div>
          <div className="text-xs text-white/85">{option.desc}</div>
          <div className="mt-1 text-[11px] text-white/90">Ekstra niveau: {formatRange(option.priceRange)}</div>
        </div>
      </div>
    </button>
  );
}

function ProjectCard({ option, active, onClick }) {
  const Icon = option.icon;
  return (
    <button
      onClick={onClick}
      className={`rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        active ? "border-sky-400 ring-2 ring-sky-200 bg-sky-50" : "border-stone-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-stone-100 p-3 text-sky-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-zinc-900">{option.label}</div>
          <div className="mt-1 text-sm text-zinc-600">{option.desc}</div>
        </div>
      </div>
    </button>
  );
}

function ChoicePills({ options, value, onSelect, renderMeta }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onSelect(option.key)}
          className={`rounded-full border px-4 py-2 text-left text-sm font-medium transition ${
            value === option.key
              ? "border-sky-500 bg-sky-500 text-white shadow-md"
              : "border-stone-200 bg-white text-zinc-700 hover:border-sky-300"
          }`}
        >
          <div>{option.label}</div>
          {renderMeta ? <div className={`mt-0.5 text-xs ${value === option.key ? "text-white/85" : "text-zinc-500"}`}>{renderMeta(option)}</div> : null}
        </button>
      ))}
    </div>
  );
}

function FilePreview({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {files.map((file, index) => (
        <div key={`${file.name}-${index}`} className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <img src={file.preview} alt={file.name} className="h-24 w-full object-cover" />
          <button
            onClick={() => onRemove(index)}
            className="absolute right-1 top-1 rounded-full bg-black/65 px-2 py-0.5 text-xs text-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function getProjectConfig(projectType) {
  return PROJECTS[projectType] || PROJECTS.bathroom;
}

function buildSteps(project) {
  return ["welcome", "project", "style", "size", "details", "photos", ...project.elementGroups.map((g) => g.key), "budget", "timeline", "contact", "summary"];
}

function buildMessages({ step, form, project, steps }) {
  const selectedProject = PROJECTS[form.projectType];
  const selectedStyle = sharedStyles.find((s) => s.key === form.style);
  const selectedSize = project.sizeOptions.find((s) => s.key === form.size);
  const budgetStepIndex = 6 + project.elementGroups.length;
  const timelineStepIndex = 7 + project.elementGroups.length;
  const contactStepIndex = 8 + project.elementGroups.length;

  return [
    {
      role: "bot",
      content: (
        <div>
          <div className="mb-1 flex items-center gap-2 font-semibold text-sky-700">
            <Sparkles className="h-4 w-4" /> {BOT_NAME}
          </div>
          Hej! Jeg hjælper dig med at gøre dit projekt mere konkret, så du både får et bedre prisestimat og et langt skarpere tilbudsgrundlag.
        </div>
      ),
      show: true,
    },
    {
      role: "bot",
      content: "Vil du have hjælp med et badeværelse eller et køkken?",
      show: step >= 1,
    },
    {
      role: "user",
      content: selectedProject ? `Jeg vil gerne have tilbud på ${selectedProject.label.toLowerCase()}.` : null,
      show: !!form.projectType,
    },
    {
      role: "bot",
      content: `Først: hvilken stemning skal dit ${project.noun} have? Hvert valg viser også et ekstra prisniveau, så du kan mærke konsekvensen med det samme.`,
      show: step >= 2,
    },
    {
      role: "user",
      content: selectedStyle ? `Jeg går efter ${selectedStyle.label.toLowerCase()} stil.` : null,
      show: !!form.style,
    },
    {
      role: "bot",
      content: `Hvor stort er ${project.nounDefinite} cirka? m² har stor betydning for både materialer, arbejdstid og pris.`,
      show: step >= 3,
    },
    {
      role: "user",
      content: selectedSize?.label || null,
      show: !!form.size,
    },
    {
      role: "bot",
      content: `Fedt. Skriv nu helt konkret hvad der skal laves i ${project.nounDefinite}. Jo mere specifik du er, jo bedre kan både estimatet og håndværkeren bruge det.`,
      show: step >= 4,
    },
    {
      role: "user",
      content: form.details || null,
      show: !!form.details,
    },
    {
      role: "bot",
      content: `Har du billeder af det nuværende ${project.noun}? Du kan uploade dem her - på mobil kan du tage dem direkte fra telefonen.`,
      show: step >= 5,
    },
    {
      role: "user",
      content: form.photos.length ? `Jeg har uploadet ${form.photos.length} billede${form.photos.length > 1 ? "r" : ""}.` : null,
      show: !!form.photos.length,
    },
    ...project.elementGroups.flatMap((group, index) => {
      const currentIndex = 6 + index;
      const choiceKey = form.elements[group.key];
      const choice = group.options.find((o) => o.key === choiceKey);
      return [
        {
          role: "bot",
          content: `Lad os tage ${group.label.toLowerCase()}. Hvilket niveau passer bedst? Jeg viser pris-range på hvert valg.`,
          show: step >= currentIndex,
        },
        {
          role: "user",
          content: choice ? `${group.label}: ${choice.label} (${formatRange(choice.priceRange)})` : null,
          show: !!choice,
        },
      ];
    }),
    {
      role: "bot",
      content: "Hvilket samlet budget føles mest realistisk for dig? Det hjælper mig med at kalibrere det endelige spænd.",
      show: step >= budgetStepIndex,
    },
    {
      role: "user",
      content: sharedBudgetOptions.find((b) => b.key === form.budget)?.label || null,
      show: !!form.budget,
    },
    {
      role: "bot",
      content: "Hvornår vil du helst i gang?",
      show: step >= timelineStepIndex,
    },
    {
      role: "user",
      content: sharedTimelineOptions.find((t) => t.key === form.timeline)?.label || null,
      show: !!form.timeline,
    },
    {
      role: "bot",
      content: "Sidste ting - hvor kan en håndværker få fat i dig?",
      show: step >= contactStepIndex,
    },
    {
      role: "user",
      content: form.phone || null,
      show: !!form.phone,
    },
  ];
}

// Clean deploy-version:
// Gem denne fil som App.jsx i en almindelig Vite + React app.
// Tilføj derudover kun package.json, index.html og main.jsx.

export default function HandvaerkerChatbotPlayful() {
  const [form, setForm] = useState({
    projectType: "",
    style: "",
    size: "",
    details: "",
    budget: "",
    timeline: "",
    phone: "",
    elements: {},
    photos: [],
  });
  const [draft, setDraft] = useState("");
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const project = getProjectConfig(form.projectType);
  const steps = buildSteps(project);
  const currentStep = steps[step];
  const messages = buildMessages({ step, form, project, steps });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, form, draft, isTyping]);

  useEffect(() => {
    return () => {
      form.photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [form.photos]);

  const estimate = useMemo(() => {
    const style = sharedStyles.find((s) => s.key === form.style);
    const size = project.sizeOptions.find((s) => s.key === form.size);
    const budget = sharedBudgetOptions.find((b) => b.key === form.budget);

    const elementLow = project.elementGroups.reduce((sum, group) => {
      const choiceKey = form.elements[group.key];
      const choice = group.options.find((o) => o.key === choiceKey);
      return sum + (choice?.priceRange[0] || 0);
    }, 0);

    const elementHigh = project.elementGroups.reduce((sum, group) => {
      const choiceKey = form.elements[group.key];
      const choice = group.options.find((o) => o.key === choiceKey);
      return sum + (choice?.priceRange[1] || 0);
    }, 0);

    const styleLow = style?.priceRange?.[0] || 0;
    const styleHigh = style?.priceRange?.[1] || 0;
    const sizeLow = size?.priceRange?.[0] || 0;
    const sizeHigh = size?.priceRange?.[1] || 0;

    const detailFactor = form.details.length > 120 ? 1.08 : form.details.length > 40 ? 1.03 : 1;
    const photoFactor = form.photos.length >= 2 ? 1.02 : 1;

    let low = Math.round((project.estimateBase.low + styleLow + sizeLow + elementLow) * detailFactor * photoFactor);
    let high = Math.round((project.estimateBase.high + styleHigh + sizeHigh + elementHigh) * detailFactor * photoFactor);

    if (style?.factor) {
      low = Math.round(low * style.factor);
      high = Math.round(high * style.factor);
    }
    if (size?.factor) {
      low = Math.round(low * size.factor);
      high = Math.round(high * size.factor);
    }
    if (budget?.factor) {
      low = Math.round(low * Math.min(budget.factor, 1.08));
      high = Math.round(high * budget.factor);
    }

    return {
      low,
      high,
      center: Math.round((low + high) / 2),
    };
  }, [form, project]);

  const feedback = useMemo(() => {
    if (estimate.center >= project.feedback.highThreshold) return project.feedback.high;
    if (estimate.center >= project.feedback.midThreshold) return project.feedback.mid;
    return project.feedback.low;
  }, [estimate.center, project]);

  const selectedProject = PROJECTS[form.projectType];
  const selectedStyle = sharedStyles.find((s) => s.key === form.style);
  const selectedSize = project.sizeOptions.find((s) => s.key === form.size);

  function advanceWithDelay(callback) {
    if (callback) callback();
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setStep((s) => Math.min(s + 1, buildSteps(getProjectConfig(form.projectType)).length - 1));
    }, STEP_DELAY);
  }

  function resetProjectDependentData(projectType) {
    setForm((prev) => ({
      ...prev,
      projectType,
      style: "",
      size: "",
      details: "",
      budget: "",
      timeline: "",
      phone: "",
      elements: {},
    }));
    setStep(1);
  }

  function saveTextAnswer() {
    if (!draft.trim()) return;
    advanceWithDelay(() => {
      setForm((prev) => ({ ...prev, details: draft.trim() }));
      setDraft("");
    });
  }

  function savePhone() {
    if (!draft.trim()) return;
    advanceWithDelay(() => {
      setForm((prev) => ({ ...prev, phone: draft.trim() }));
      setDraft("");
    });
  }

  function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const nextPhotos = files.slice(0, 6).map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...nextPhotos].slice(0, 6),
    }));
    event.target.value = "";
  }

  function removePhoto(indexToRemove) {
    setForm((prev) => {
      const photo = prev.photos[indexToRemove];
      if (photo) URL.revokeObjectURL(photo.preview);
      return {
        ...prev,
        photos: prev.photos.filter((_, index) => index !== indexToRemove),
      };
    });
  }

  function renderComposer() {
    if (currentStep === "welcome") {
      return (
        <div className="flex justify-end">
          <Button onClick={() => advanceWithDelay()} className="rounded-full bg-sky-600 hover:bg-sky-700">
            Lad os gå i gang <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (currentStep === "project") {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {Object.values(PROJECTS).map((option) => (
            <ProjectCard
              key={option.key}
              option={option}
              active={form.projectType === option.key}
              onClick={() => advanceWithDelay(() => resetProjectDependentData(option.key))}
            />
          ))}
        </div>
      );
    }

    if (currentStep === "style") {
      return (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {sharedStyles.map((option) => (
              <ImageChoiceCard
                key={option.key}
                option={option}
                active={form.style === option.key}
                onClick={() => advanceWithDelay(() => setForm((prev) => ({ ...prev, style: option.key })))}
              />
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === "size") {
      return (
        <ChoicePills
          options={project.sizeOptions}
          value={form.size}
          onSelect={(key) => advanceWithDelay(() => setForm((prev) => ({ ...prev, size: key })))}
          renderMeta={(option) => `Ekstra niveau: ${formatRange(option.priceRange)}`}
        />
      );
    }

    if (currentStep === "details") {
      return (
        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            className="rounded-[20px] border-stone-200 bg-white"
            placeholder={project.detailsPlaceholder}
          />
          <div className="flex justify-end">
            <Button onClick={saveTextAnswer} className="rounded-full bg-sky-600 hover:bg-sky-700">
              Send svar
            </Button>
          </div>
        </div>
      );
    }

    if (currentStep === "photos") {
      return (
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[22px] border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-zinc-700 hover:bg-stone-100">
            <Upload className="h-4 w-4" /> Upload billeder
            <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handlePhotoUpload} />
          </label>
          <div className="text-xs text-zinc-500">På mobil kan kameraet åbne direkte. Du kan uploade op til 6 billeder.</div>
          <FilePreview files={form.photos} onRemove={removePhoto} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-full border-stone-300" onClick={() => advanceWithDelay()}>
              Spring over
            </Button>
            <Button className="rounded-full bg-sky-600 hover:bg-sky-700" onClick={() => advanceWithDelay()}>
              Fortsæt
            </Button>
          </div>
        </div>
      );
    }

    const group = project.elementGroups.find((g) => g.key === currentStep);
    if (group) {
      const Icon = group.icon;
      return (
        <div className="space-y-3">
          <div className="rounded-[22px] bg-gradient-to-r from-stone-100 to-sky-50 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold text-zinc-800">
              <Icon className="h-4 w-4" /> {group.label}
            </div>
            <ChoicePills
              options={group.options}
              value={form.elements[group.key]}
              onSelect={(choiceKey) =>
                advanceWithDelay(() =>
                  setForm((prev) => ({
                    ...prev,
                    elements: { ...prev.elements, [group.key]: choiceKey },
                  }))
                )
              }
              renderMeta={(option) => formatRange(option.priceRange)}
            />
            <div className="mt-3 text-xs text-zinc-600">Brug det som et prisniveau, ikke som et endeligt produktvalg.</div>
          </div>
        </div>
      );
    }

    if (currentStep === "budget") {
      return (
        <ChoicePills
          options={sharedBudgetOptions}
          value={form.budget}
          onSelect={(key) => advanceWithDelay(() => setForm((prev) => ({ ...prev, budget: key })))}
        />
      );
    }

    if (currentStep === "timeline") {
      return (
        <ChoicePills
          options={sharedTimelineOptions}
          value={form.timeline}
          onSelect={(key) => advanceWithDelay(() => setForm((prev) => ({ ...prev, timeline: key })))}
        />
      );
    }

    if (currentStep === "contact") {
      return (
        <div className="space-y-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="rounded-full border-stone-200 bg-white"
            placeholder="Telefonnummer"
          />
          <div className="flex justify-end">
            <Button onClick={savePhone} className="rounded-full bg-sky-600 hover:bg-sky-700">
              Gem nummer
            </Button>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fafc,_#f0f9ff_42%,_#ffffff_72%)] p-4 md:p-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-[32px] border-0 bg-white/90 shadow-2xl backdrop-blur">
          <div className="border-b border-stone-200 bg-gradient-to-r from-sky-600 via-teal-500 to-cyan-500 p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <Wand2 className="h-4 w-4" /> Legende håndværkerbot
                </div>
                <div className="mt-1 text-2xl font-bold">Mød {BOT_NAME}</div>
                <div className="mt-1 text-sm text-white/90">En chat der hjælper brugeren med at blive konkret - uden at føles som en kedelig formular.</div>
              </div>
              <div className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">{Math.round((step / (steps.length - 1)) * 100)}%</div>
            </div>
          </div>

          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="h-[64vh] space-y-4 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {messages.filter((m) => m.show).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChatBubble role={message.role}>{message.content}</ChatBubble>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && <TypingBubble />}

              {!isTyping && currentStep !== "summary" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex justify-start">
                    <div className="w-full max-w-[92%] rounded-[28px] border border-stone-200 bg-stone-50 p-4 md:max-w-[82%]">
                      {renderComposer()}
                    </div>
                  </div>
                </motion.div>
              )}

              {!isTyping && currentStep === "summary" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <ChatBubble role="bot">
                    Perfekt. Nu har jeg nok til at lave et prisestimat og et brief, som en håndværker faktisk kan bruge.
                  </ChatBubble>

                  <div className="grid gap-4">
                    <div className="rounded-[28px] bg-gradient-to-r from-sky-600 to-teal-500 p-5 text-white shadow-lg">
                      <div className="text-sm text-white/85">Vejledende prisinterval</div>
                      <div className="mt-2 text-3xl font-bold">
                        {formatDkk(estimate.low)} - {formatDkk(estimate.high)}
                      </div>
                      <div className="mt-3 text-sm text-white/90">{feedback}</div>
                    </div>

                    <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center gap-2 font-semibold text-zinc-900">
                        <CheckCircle2 className="h-4 w-4 text-sky-600" /> Klar til håndværker
                      </div>
                      <div className="space-y-3 text-sm text-zinc-700">
                        <div><span className="font-medium">Projekt:</span> {selectedProject?.label || "Ikke valgt"}</div>
                        <div><span className="font-medium">Stil:</span> {selectedStyle?.label || "Ikke valgt"} {selectedStyle ? `(${formatRange(selectedStyle.priceRange)})` : ""}</div>
                        <div><span className="font-medium">Størrelse:</span> {selectedSize?.label || "Ikke valgt"} {selectedSize ? `(${formatRange(selectedSize.priceRange)})` : ""}</div>
                        <div><span className="font-medium">Opgave:</span> {form.details || "Ikke angivet"}</div>
                        <div>
                          <span className="font-medium">Prisvalg:</span>
                          <ul className="mt-2 space-y-1 pl-4">
                            {project.elementGroups.map((group) => {
                              const choice = group.options.find((o) => o.key === form.elements[group.key]);
                              return (
                                <li key={group.key} className="list-disc">
                                  {group.label}: {choice ? `${choice.label} (${formatRange(choice.priceRange)})` : "Ikke valgt"}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div><span className="font-medium">Billeder:</span> {form.photos.length ? `${form.photos.length} uploadet` : "Ingen uploadet"}</div>
                        <div><span className="font-medium">Budget:</span> {sharedBudgetOptions.find((b) => b.key === form.budget)?.label || "Ikke valgt"}</div>
                        <div><span className="font-medium">Tidshorisont:</span> {sharedTimelineOptions.find((t) => t.key === form.timeline)?.label || "Ikke valgt"}</div>
                        <div><span className="font-medium">Telefon:</span> {form.phone || "Ikke angivet"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[30px] border-0 bg-white/90 shadow-xl backdrop-blur">
            <CardContent className="p-6">
              <div className="text-lg font-semibold">Nu er strukturen mere skalerbar</div>
              <div className="mt-4 space-y-3 text-sm text-zinc-700">
                <div className="rounded-[20px] bg-sky-50 p-4">Hvert projekt er nu defineret som konfigurationsdata i stedet for hårdkodet logik.</div>
                <div className="rounded-[20px] bg-stone-50 p-4">Størrelser, kategorier, basepriser, feedback og sprog styres pr. projekt.</div>
                <div className="rounded-[20px] bg-teal-50 p-4">Det gør det væsentligt lettere at tilføje tag, varmepumpe, gulv eller maler senere.</div>
                <div className="rounded-[20px] bg-cyan-50 p-4">Chat-flowet og UI-komponenterne genbruges nu på tværs af projekttyper.</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-0 bg-white/90 shadow-xl backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <ImageIcon className="h-5 w-5 text-sky-600" /> Hvad du kan tilføje næste gang
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">Tag</Badge>
                <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">Varmepumpe</Badge>
                <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">Gulv</Badge>
                <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">Maler</Badge>
                <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">Facade</Badge>
              </div>
              <div className="mt-4 text-sm text-zinc-600">
                For nye projekttyper behøver du nu primært at tilføje en ny konfiguration med labels, pris-ranges og spørgsmål.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-0 bg-white/90 shadow-xl backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Ruler className="h-5 w-5 text-sky-600" /> Arkitekturretning
              </div>
              <div className="space-y-2 text-sm text-zinc-700">
                <div>Projektdata ligger samlet i en PROJECTS-konfiguration.</div>
                <div>Flow, messages og estimater bygges dynamisk ud fra valgt projekt.</div>
                <div>Det reducerer specialkode og gør systemet lettere at vedligeholde.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
