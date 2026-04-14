export const ADDRESS_SUGGESTIONS = [
  'Østerbrogade 45, 2100 København Ø',
  'Nørrebrogade 120, 2200 København N',
  'Gammel Kongevej 88, 1850 Frederiksberg C',
  'Vesterbrogade 33, 1620 København V',
  'Amagerbrogade 210, 2300 København S',
  'Lyngby Hovedgade 54, 2800 Kongens Lyngby',
  'Roskildevej 120, 2500 Valby',
  'Frederiksborgvej 15, 2400 København NV'
];

export function getAddressSuggestions(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ADDRESS_SUGGESTIONS.filter((item) => item.toLowerCase().includes(q)).slice(0, 5);
}
