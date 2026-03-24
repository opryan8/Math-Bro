import { Theme, Translations, Language } from './types';

// Switching to gemini-3-flash-preview which has much more generous rate limits
// on the free tier than Pro, while still being extremely capable at math.
export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const THEMES: Theme[] = [
  {
    id: 'cyber-dashboard',
    name: 'Cyber Dark',
    primary: 'bg-blue-600',
    gradient: 'from-blue-500 to-indigo-600',
    background: 'bg-[#0B0E14]',
    panel: 'bg-[#151A25]',
    text: 'text-slate-200',
    bubbleUser: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    bubbleModel: 'bg-[#1E293B] text-slate-200 border border-slate-700/50',
  },
  {
    id: 'neon-purple',
    name: 'Neon Flux',
    primary: 'bg-fuchsia-600',
    gradient: 'from-fuchsia-600 to-purple-600',
    background: 'bg-[#1a0b2e]',
    panel: 'bg-[#2d1b4e]',
    text: 'text-fuchsia-50',
    bubbleUser: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white',
    bubbleModel: 'bg-[#3b2a5f] text-fuchsia-100 border border-fuchsia-800/50',
  },
  {
    id: 'emerald-matrix',
    name: 'Matrix',
    primary: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-teal-600',
    background: 'bg-[#022c22]',
    panel: 'bg-[#064e3b]',
    text: 'text-emerald-50',
    bubbleUser: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    bubbleModel: 'bg-[#065f46] text-emerald-100 border border-emerald-800/50',
  }
];

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    welcome: "Hello! I'm Math Bro. I can solve algebra, geometry, and calculus problems. Upload an image or use the mic to speak.",
    inputPlaceholder: "Type a math problem...",
    recording: "Listening...",
    releaseToSend: "Tap to Stop",
    thinking: "Calculating...",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    clearChat: "Clear Chat",
    uploadImage: "Upload Image",
    send: "Send",
    appName: "Math Bro",
    tagline: "AI Math Assistant",
    error429: "Too many requests. Retrying automatically or please wait a moment.",
    madeBy: "Made by Rayane Maguenaoui"
  },
  fr: {
    welcome: "Salut! Je suis Math Bro. Je peux résoudre des problèmes d'algèbre, de géométrie et de calcul. Téléchargez une image ou utilisez le micro.",
    inputPlaceholder: "Écrivez un problème de maths...",
    recording: "Écoute en cours...",
    releaseToSend: "Appuyez pour arrêter",
    thinking: "Calcul en cours...",
    settings: "Paramètres",
    language: "Langue",
    theme: "Thème",
    clearChat: "Effacer",
    uploadImage: "Télécharger une image",
    send: "Envoyer",
    appName: "Math Bro",
    tagline: "Assistant Math IA",
    error429: "Trop de requêtes. Nouvelle tentative automatique ou veuillez patienter.",
    madeBy: "Créé par Rayane Maguenaoui"
  },
  ar: {
    welcome: "مرحباً! أنا ماث برو. يمكنني حل مسائل الجبر والهندسة وحساب التفاضل والتكامل. قم بتحميل صورة أو استخدم الميكروفون للتحدث.",
    inputPlaceholder: "اكتب مسألة رياضية...",
    recording: "جاري الاستماع...",
    releaseToSend: "اضغط للإيقاف",
    thinking: "جاري الحساب...",
    settings: "الإعدادات",
    language: "اللغة",
    theme: "المظهر",
    clearChat: "مسح المحادثة",
    uploadImage: "رفع صورة",
    send: "إرسال",
    appName: "ماث برو",
    tagline: "مساعد الرياضيات الذكي",
    error429: "طلبات كثيرة جداً. جاري إعادة المحاولة تلقائياً أو يرجى الانتظار قليلاً.",
    madeBy: "صنع بواسطة Rayane Maguenaoui"
  }
};