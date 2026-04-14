import { Settings, FormState } from './types';

export const DEFAULT_SETTINGS: Settings = {
  companyName: 'Nordic VVS',
  productName: 'KlarKunde Assistant',
  accent: '#0f766e',
  accentSoft: '#ccfbf1',
  accentDeep: '#134e4a',
  logoText: 'NV',
  logoUrl: '',
  googleMapsApiKey: '',
  businessEmail: '',
  hourlyRate: 650,
  acuteMin: 800,
  acuteMax: 2500,
  fastMin: 300,
  fastMax: 800,
  zoneMin: 150,
  zoneMax: 500,
  difficultAccessMin: 400,
  difficultAccessMax: 1000
};

export const INITIAL_FORM: FormState = {
  task: '',
  toiletWork: '',
  installation: '',
  delivery: '',
  toiletType: '',
  armaturType: '',
  bruserType: '',
  radiatorType: '',
  machineType: '',
  drainType: '',
  leakType: '',
  tankType: '',
  level: '',
  access: 'Normal',
  propertyType: '',
  urgency: '',
  zip: '',
  address: '',
  details: '',
  name: '',
  phone: '',
  email: '',
  acceptPrice: '',
  wantContact: '',
  images: [],
  imagesSkipped: false
};

export const TASKS = [
  'Toilet',
  'Armatur',
  'Bruser',
  'Radiator',
  'Vaskemaskine / opvaskemaskine',
  'Afløb / vandlås',
  'Lækage / problem',
  'Varmtvandsbeholder / pumpe',
  'Andet'
] as const;

export const OPTION_SETS = {
  toiletWork: ['Udskiftning', 'Reparation', 'Ny installation', 'Ved ikke'],
  installation: ['Ja, det skal bare udskiftes', 'Ja, men der skal måske tilpasses', 'Nej, det er ny installation', 'Ved ikke'],
  delivery: ['Jeg har selv produktet', "VVS'er skal levere", 'Ved ikke endnu'],
  toiletType: ['Gulvstående', 'Væghængt', 'Ved ikke'],
  armaturType: ['Køkkenarmatur', 'Håndvaskarmatur', 'Begge dele', 'Ved ikke'],
  bruserType: ['Brusersæt', 'Brusearmatur', 'Begge dele', 'Ved ikke'],
  radiatorType: ['Radiatorventil', 'Termostat', 'Radiatorudskiftning', 'Ved ikke'],
  machineType: ['Vaskemaskine', 'Opvaskemaskine', 'Begge dele'],
  drainType: ['Vandlås', 'Afløb under vask', 'Stoppet afløb', 'Gulvafløb', 'Ved ikke'],
  leakType: ['Drypper', 'Lækker', 'Virker ikke', 'Ukendt problem'],
  tankType: ['Varmtvandsbeholder', 'Cirkulationspumpe', 'Andet', 'Ved ikke'],
  level: ['Standard', 'Mellem', 'Premium', 'Ved ikke'],
  access: ['Normal', 'Trang / svært', 'Meget svært', 'Ved ikke'],
  propertyType: ['Hus', 'Lejlighed', 'Erhverv'],
  urgency: ['Akut', 'Inden for få dage', 'Inden for 1-2 uger', 'Fleksibel'],
  budgetFit: ['Ja', 'Måske', 'Nej'],
  contactChoice: ['Ja, kontakt mig', 'Nej tak, kun estimat']
};
