import { budgetOptions, timelineOptions } from "../configs/shared.js";

export function buildTranscript(project, answers, appName) {
  const category = project.categoryOptions.find((item) => item.key === answers.category);
  const size = project.sizeOptions.find((item) => item.key === answers.size);

  return [
    {
      role: "bot",
      key: "intro",
      content: `Hej! Jeg er ${appName}, og jeg hjælper dig med at gøre din opgave mere konkret, så du får et bedre prisestimat og et skarpere tilbudsgrundlag.`,
      show: true,
    },
    {
      role: "bot",
      key: "project-q",
      content: "Hvad skal du have hjælp til?",
      show: true,
    },
    {
      role: "user",
      key: "project-a",
      content: project.label,
      show: true,
    },
    {
      role: "bot",
      key: "category-q",
      content: `${project.categoryQuestion} Hvert valg viser også et ekstra prisniveau.`,
      show: !!answers.projectType,
    },
    {
      role: "user",
      key: "category-a",
      content: category ? `${category.label} (${formatRange(category.priceRange)})` : null,
      show: !!answers.category,
    },
    {
      role: "bot",
      key: "size-q",
      content: `${project.sizeQuestion} Det har stor betydning for materialer, arbejdstid og pris.`,
      show: !!answers.category,
    },
    {
      role: "user",
      key: "size-a",
      content: size ? `${size.label} (${formatRange(size.priceRange)})` : null,
      show: !!answers.size,
    },
    {
      role: "bot",
      key: "details-q",
      content: project.detailQuestion,
      show: !!answers.size,
    },
    {
      role: "user",
      key: "details-a",
      content: answers.details || null,
      show: !!answers.details,
    },
    {
      role: "bot",
      key: "photos-q",
      content: project.photoQuestion,
      show: !!answers.details,
    },
    {
      role: "user",
      key: "photos-a",
      content: answers.photos?.length ? `Jeg har uploadet ${answers.photos.length} billede${answers.photos.length > 1 ? "r" : ""}.` : null,
      show: (answers.photos?.length || 0) > 0,
    },
    ...project.elementGroups.flatMap((group) => {
      const chosen = group.options.find((item) => item.key === answers.elements?.[group.key]);
      return [
        {
          role: "bot",
          key: `${group.key}-q`,
          content: `Lad os tage ${group.label.toLowerCase()}. Hvilket niveau passer bedst?`,
          show: !!answers.details,
        },
        {
          role: "user",
          key: `${group.key}-a`,
          content: chosen ? `${group.label}: ${chosen.label} (${formatRange(chosen.priceRange)})` : null,
          show: !!chosen,
        },
      ];
    }),
    {
      role: "bot",
      key: "budget-q",
      content: "Hvilket samlet budget føles mest realistisk for dig?",
      show: true,
    },
    {
      role: "user",
      key: "budget-a",
      content: budgetOptions.find((item) => item.key === answers.budget)?.label || null,
      show: !!answers.budget,
    },
    {
      role: "bot",
      key: "timeline-q",
      content: "Hvornår vil du helst i gang?",
      show: !!answers.budget,
    },
    {
      role: "user",
      key: "timeline-a",
      content: timelineOptions.find((item) => item.key === answers.timeline)?.label || null,
      show: !!answers.timeline,
    },
    {
      role: "bot",
      key: "contact-q",
      content: "Til sidst skal jeg bruge dine kontaktoplysninger.",
      show: !!answers.timeline,
    },
    {
      role: "user",
      key: "contact-name-a",
      content: answers.name ? `Navn: ${answers.name}` : null,
      show: !!answers.name,
    },
    {
      role: "user",
      key: "contact-email-a",
      content: answers.email ? `E-mail: ${answers.email}` : null,
      show: !!answers.email,
    },
    {
      role: "user",
      key: "contact-phone-a",
      content: answers.phone ? `Telefon: ${answers.phone}` : null,
      show: !!answers.phone,
    },
    {
      role: "user",
      key: "contact-address-a",
      content: answers.address ? `Adresse: ${answers.address}` : null,
      show: !!answers.address,
    },
  ];
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
