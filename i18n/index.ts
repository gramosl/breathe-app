import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { storage } from '@/store/useStore';

// Translation resources
const resources = {
  en: {
    translation: {
      "onboarding.hook": "Hi there.\nFeeling a bit... floaty?",
      "onboarding.ghost_hint": "Tap the ghost to say hello",
      "onboarding.skip": "Skip Onboarding (Dev)",
      "onboarding.begin": "Yeah, a little",
      
      "onboarding.check_title": "Phones are great.\nBut sometimes they turn us into floating heads.",
      "onboarding.check_subtitle": "When was the last time you really felt your feet on the floor?",
      "onboarding.options.rarely": "Just now",
      "onboarding.options.often": "A while ago",
      "onboarding.options.always": "Wait, I have feet?",

      "onboarding.somatic.intro": "Let's try something weird.",
      "onboarding.somatic.instruction": "Press & Hold the screen.\nDon't let go.",
      "onboarding.somatic.release": "Welcome back.",
      
      "onboarding.habit.title": "Where do you need to land?",
      "onboarding.habit.subtitle": "Pick a moment to reclaim",
      "onboarding.continue": "Let's Land",
      "onboarding.processing": "Connecting to your body...",
      
      "paywall.pro": "SelfConnect Pro",
      "paywall.title": "Stay grounded\nfor good.",
      "paywall.subtitle": "3 Days Free. Cancel if you prefer floating.",
      "paywall.button": "Start Free Trial",
      "paywall.error": "Something went wrong. Try again.",
      "paywall.benefit1": "Full Ghost Evolution",
      "paywall.benefit2": "Unlimited SOS Anchors",
      "paywall.benefit3": "Ghost History Garden",
      "paywall.best_value": "Best Value",
      "paywall.per_year": "/ year",
      "paywall.per_month": "/ month",
      "paywall.restore": "Restore Purchases",
      "paywall.terms": "Terms & Privacy",
      
      "home.streak": "{{count}} Day Streak",
      "home.daily_rhythm": "Daily Rhythm",
      "home.ghost.1": "Feeling Disconnected",
      "home.ghost.2": "Awakening",
      "home.ghost.3": "Vibrant",
      "home.time.morning": "Morning",
      "home.time.noon": "Noon",
      "home.time.evening": "Evening",
      
      "challenge.morning.title": "The Anchor",
      "challenge.morning.desc": "Drink your coffee without a screen. Feel the warmth. Just exist.",
      "challenge.noon.title": "The Circuit Breaker",
      "challenge.noon.desc": "Shake your hands for 10 seconds. Reset your nervous system.",
      "challenge.evening.title": "Digital Sunset",
      "challenge.evening.desc": "Turn down your screen brightness. Say goodnight to the noise.",
      "challenge.done": "Done",
      "challenge.close": "Close",
      "challenge.pulse_recorded": "Pulse Recorded",

      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.close": "Close",
      "settings.dev_tools": "Dev Tools",
      "settings.reset_daily": "Reset Daily Progress",
      "settings.reset_full": "Reset Onboarding (Full Wipe)"
    }
  },
  es: {
    translation: {
      "onboarding.hook": "Hola.\n¿Te sientes un poco... flotando?",
      "onboarding.ghost_hint": "Toca al fantasma para saludar",
      "onboarding.skip": "Saltar Onboarding (Dev)",
      "onboarding.begin": "Sí, un poco",
      
      "onboarding.check_title": "Los móviles molan.\nPero a veces nos convierten en cabezas flotantes.",
      "onboarding.check_subtitle": "¿Cuándo fue la última vez que sentiste tus pies en el suelo?",
      "onboarding.options.rarely": "Ahora mismo",
      "onboarding.options.often": "Hace un rato",
      "onboarding.options.always": "Espera, ¿tengo pies?",

      "onboarding.somatic.intro": "Probemos algo raro.",
      "onboarding.somatic.instruction": "Mantén pulsada la pantalla.\nNo sueltes.",
      "onboarding.somatic.release": "Bienvenido de vuelta.",
      
      "onboarding.habit.title": "¿Dónde necesitas aterrizar?",
      "onboarding.habit.subtitle": "Elige un momento para recuperar",
      "onboarding.continue": "Aterricemos",
      "onboarding.processing": "Conectando con tu cuerpo...",
      
      "paywall.pro": "SelfConnect Pro",
      "paywall.title": "Mantente conectado\npara siempre.",
      "paywall.subtitle": "3 días gratis. Cancela si prefieres flotar.",
      "paywall.button": "Empezar Prueba Gratuita",
      "paywall.error": "Algo salió mal. Inténtalo de nuevo.",
      "paywall.benefit1": "Evolución Total del Fantasma",
      "paywall.benefit2": "Anclas SOS Ilimitadas",
      "paywall.benefit3": "Jardín de Historia",
      "paywall.best_value": "Mejor Valor",
      "paywall.per_year": "/ año",
      "paywall.per_month": "/ mes",
      "paywall.restore": "Restaurar Compras",
      "paywall.terms": "Términos y Privacidad",

      "home.streak": "Racha de {{count}} días",
      "home.daily_rhythm": "Ritmo Diario",
      "home.ghost.1": "Sintiéndote Desconectado",
      "home.ghost.2": "Despertando",
      "home.ghost.3": "Vibrante",
      "home.time.morning": "Mañana",
      "home.time.noon": "Mediodía",
      "home.time.evening": "Noche",

      "challenge.morning.title": "El Ancla",
      "challenge.morning.desc": "Bebe tu café sin pantallas. Siente el calor. Simplemente existe.",
      "challenge.noon.title": "El Cortocircuito",
      "challenge.noon.desc": "Sacude tus manos 10 segundos. Reinicia tu sistema nervioso.",
      "challenge.evening.title": "Atardecer Digital",
      "challenge.evening.desc": "Baja el brillo de tu pantalla. Di buenas noches al ruido.",
      "challenge.done": "Hecho",
      "challenge.close": "Cerrar",
      "challenge.pulse_recorded": "Pulso Registrado",

      "settings.title": "Ajustes",
      "settings.language": "Idioma",
      "settings.close": "Cerrar",
      "settings.dev_tools": "Herramientas Dev",
      "settings.reset_daily": "Reiniciar Progreso Diario",
      "settings.reset_full": "Reiniciar Onboarding (Borrado Total)"
    }
  }
};

// Language persistence
const STORE_LANGUAGE_KEY = 'settings.language';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    try {
      const savedLanguage = storage.getString(STORE_LANGUAGE_KEY);
      if (savedLanguage) {
        return callback(savedLanguage);
      }
    } catch (error) {
      console.log('Error reading language', error);
    }
    
    // Fallback to device locale
    const locales = Localization.getLocales();
    callback(locales[0]?.languageCode ?? 'es');
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    storage.set(STORE_LANGUAGE_KEY, language);
  }
};

i18n
  .use(initReactI18next)
  .use(languageDetector as any)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
        useSuspense: false,
    }
  });

export default i18n;
