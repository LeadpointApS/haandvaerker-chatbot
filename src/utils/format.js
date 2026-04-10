export function formatDkk(value) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRange(range) {
  return `${formatDkk(range[0])} - ${formatDkk(range[1])}`;
}

export function createLeadId() {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
