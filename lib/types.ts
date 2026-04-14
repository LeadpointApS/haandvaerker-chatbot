export type Settings = {
  companyName: string;
  productName: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
  logoText: string;
  logoUrl: string;
  googleMapsApiKey: string;
  businessEmail: string;
  hourlyRate: number;
  acuteMin: number;
  acuteMax: number;
  fastMin: number;
  fastMax: number;
  zoneMin: number;
  zoneMax: number;
  difficultAccessMin: number;
  difficultAccessMax: number;
};

export type FormState = {
  task: string;
  toiletWork: string;
  installation: string;
  delivery: string;
  toiletType: string;
  armaturType: string;
  bruserType: string;
  radiatorType: string;
  machineType: string;
  drainType: string;
  leakType: string;
  tankType: string;
  level: string;
  access: string;
  propertyType: string;
  urgency: string;
  zip: string;
  address: string;
  details: string;
  name: string;
  phone: string;
  email: string;
  acceptPrice: string;
  wantContact: string;
  images: UploadedImage[];
  imagesSkipped: boolean;
};

export type UploadedImage = {
  name: string;
  url: string;
};

export type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string;
};

export type SummaryEntry = {
  id: string;
  question: string;
  answer: string;
};

export type QuestionType = 'task' | 'options' | 'input' | 'textarea' | 'address' | 'images';

export type ConversationItem = {
  key: keyof FormState;
  type: QuestionType;
  label?: string;
  placeholder?: string;
  options?: string[];
  optional?: boolean;
  condition?: (state: FormState) => boolean;
};

export type EstimateResult = {
  min: number;
  max: number;
  manual: boolean;
  included: string[];
  disclaimers: string[];
};
