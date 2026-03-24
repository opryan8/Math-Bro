export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio'
}

export type Language = 'en' | 'fr' | 'ar';

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
  type: MessageType;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  timestamp: number;
}

export interface Theme {
  id: string;
  name: string;
  primary: string; // Used for accents/buttons
  gradient: string; // For headers/highlights
  background: string; // Main app background
  panel: string; // Chat area background
  text: string;
  bubbleUser: string;
  bubbleModel: string;
}

export interface Translations {
  welcome: string;
  inputPlaceholder: string;
  recording: string;
  releaseToSend: string; // repurposed as "Stop"
  thinking: string;
  settings: string;
  language: string;
  theme: string;
  clearChat: string;
  uploadImage: string;
  send: string;
  appName: string;
  tagline: string;
  error429: string;
  madeBy: string;
}