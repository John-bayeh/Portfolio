/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

// ─── Translation dictionary ───────────────────────────────────────────────────
export const translations = {
  en: {
    // Dock / nav labels
    nav: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact",
    },
    // Hero
    hero: {
      available: "Available for work",
      tagline: "Frontend Developer · ETH · 2026",
      heading1: "I BUILD",
      heading2: "THINGS",
      heading3: "FOR THE WEB.",
      bio1: "a frontend developer based in Bahir Dar, Ethiopia — crafting fast, polished interfaces that feel as good as they look.",
      viewWork: "View Work",
      getInTouch: "Get In Touch",
      scroll: "Scroll",
      projectsShipped: "Projects Shipped",
    },
    // Projects
    projects: {
      sectionLabel: "Selected Work",
      heading1: "MY ",
      heading2: "WORK",
      subtitle: "Six shipped products.",
    },
    // About
    about: {
      sectionLabel: "About Me",
      heading: "Designing & building for the",
      headingAccent: "web",
      bio: "I'm Yohannes Bayeh, a frontend developer from Bahir Dar, Ethiopia. I turn ideas into fast, accessible, and polished web experiences — pairing solid engineering with an eye for detail. I love shipping products that people actually enjoy using.",
      cta: "Let's work together",
      processLabel: "My Process",
      yearsExp: "Years Experience",
      projectsShipped: "Projects Shipped",
      steps: [
        { n: "01", label: "SCOPE", desc: "Understand the problem & define the goal." },
        { n: "02", label: "DESIGN", desc: "Wireframe the flow and the interface." },
        { n: "03", label: "BUILD", desc: "Write clean, component-driven code." },
        { n: "04", label: "TEST", desc: "Verify behaviour across devices." },
        { n: "05", label: "SHIP", desc: "Deploy and iterate on feedback." },
      ],
    },
    // Contact
    contact: {
      available: "Currently available",
      heading1: "LET'S BUILD",
      heading2: "SOMETHING.",
      fieldName: "Name",
      fieldEmail: "Email",
      fieldMessage: "Message",
      send: "Send Message",
      sending: "Sending…",
      sent: "Message sent ✓",
      tryAgain: "Try again",
      successToast: "Message sent — I'll get back to you soon.",
      errorMsg: "Something went wrong. Please email me directly at",
      footer: "Designed & Built by",
      footerName: "Yohannes Bayeh",
    },
  },
  am: {
    nav: {
      home: "መነሻ",
      projects: "ፕሮጀክቶች",
      about: "ስለኔ",
      contact: "ያግኙኝ",
    },
    hero: {
      available: "ለሥራ ዝግጁ ነኝ",
      tagline: "ፊደ ዲቬሎፐር · ኢትዮጵያ · 2026",
      heading1: "እገነባለሁ",
      heading2: "ነገሮችን",
      heading3: "ለዌብ።",
      bio1: "ከባሕር ዳር፣ ኢትዮጵያ የተነሳ ፊደ ዲቬሎፐር — ፈጣን፣ ጥራት ያለው ዩዘር ኢንተርፌስ እገነባለሁ።",
      viewWork: "ሥራዎቼን ይመልከቱ",
      getInTouch: "ያግኙኝ",
      scroll: "ወደ ታች",
      projectsShipped: "የተሰሩ ፕሮጀክቶች",
    },
    projects: {
      sectionLabel: "የተመረጡ ሥራዎች",
      heading1: "ሥራዎቼ",
      heading2: "",
      subtitle: "ስድስት የተጠናቀቁ ፕሮጀክቶች።",
    },
    about: {
      sectionLabel: "ስለኔ",
      heading: "ለዌቡ ዲዛይን እና",
      headingAccent: "ልማት",
      bio: "እኔ ዮሐንስ ባዬህ ነኝ፣ ከባሕር ዳር፣ ኢትዮጵያ የተነሳ ፊደ ዲቬሎፐር። ሀሳቦችን ወደ ፈጣን፣ ተደራሽ እና ጥራት ያለው ዌብ ልምዶች እቀይራለሁ — ጠንካራ ምህንድስናን ከዝርዝር ነጥቦች ጋር አዋህዳለሁ።",
      cta: "አብሮ እንሥራ",
      processLabel: "ሂደቴ",
      yearsExp: "ዓመታት ልምድ",
      projectsShipped: "የተሰሩ ፕሮጀክቶች",
      steps: [
        { n: "01", label: "ዕቅድ", desc: "ችግሩን ተረዳ እና ግቡን አስቀምጥ።" },
        { n: "02", label: "ዲዛይን", desc: "ፍሰቱን እና ኢንተርፌሱን አቅድ።" },
        { n: "03", label: "ልማት", desc: "ንጹህ፣ ኮምፖነንት-ተኮር ኮድ ፃፍ።" },
        { n: "04", label: "ፈተና", desc: "ባህሪውን በተለያዩ ዳቴዎች ላይ አረጋግጥ።" },
        { n: "05", label: "ልቀት", desc: "ዒላማ ተወ እና ግብረ-ሰጥዕ ላይ ሙከራ አድርግ።" },
      ],
    },
    contact: {
      available: "አሁን ዝግጁ ነኝ",
      heading1: "አብሮ",
      heading2: "እንሥራ።",
      fieldName: "ስም",
      fieldEmail: "ኢሜይል",
      fieldMessage: "መልዕክት",
      send: "ላክ",
      sending: "በመላክ ላይ…",
      sent: "ተልኳል ✓",
      tryAgain: "እንደገና ሞክር",
      successToast: "መልዕክቱ ተልኳል — በቅርቡ እመልሳለሁ።",
      errorMsg: "ችግር ተፈጠረ። በቀጥታ ኢሜይሌ ላይ ደርሰኝ",
      footer: "የተዘጋጀ እና የተሠራ በ",
      footerName: "ዮሐንስ ባዬህ",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      about: "À propos",
      contact: "Contact",
    },
    hero: {
      available: "Disponible pour travailler",
      tagline: "Développeur Frontend · ÉTH · 2026",
      heading1: "JE CONSTRUIS",
      heading2: "DES CHOSES",
      heading3: "POUR LE WEB.",
      bio1: "développeur frontend basé à Bahir Dar, Éthiopie — créant des interfaces rapides et soignées qui sont aussi belles que fonctionnelles.",
      viewWork: "Voir mes travaux",
      getInTouch: "Me contacter",
      scroll: "Défiler",
      projectsShipped: "Projets livrés",
    },
    projects: {
      sectionLabel: "Travaux sélectionnés",
      heading1: "MES ",
      heading2: "PROJETS",
      subtitle: "Six produits livrés.",
    },
    about: {
      sectionLabel: "À propos de moi",
      heading: "Concevoir & construire pour le",
      headingAccent: "web",
      bio: "Je suis Yohannes Bayeh, développeur frontend de Bahir Dar, Éthiopie. Je transforme des idées en expériences web rapides, accessibles et soignées — alliant ingénierie solide et souci du détail. J'adore livrer des produits que les gens aiment vraiment utiliser.",
      cta: "Travaillons ensemble",
      processLabel: "Mon Processus",
      yearsExp: "Ans d'Expérience",
      projectsShipped: "Projets Livrés",
      steps: [
        { n: "01", label: "ANALYSE", desc: "Comprendre le problème et définir l'objectif." },
        { n: "02", label: "DESIGN", desc: "Créer le flux et l'interface." },
        { n: "03", label: "BUILD", desc: "Écrire un code propre et orienté composants." },
        { n: "04", label: "TEST", desc: "Vérifier le comportement sur tous les appareils." },
        { n: "05", label: "LIVRAISON", desc: "Déployer et itérer sur les retours." },
      ],
    },
    contact: {
      available: "Actuellement disponible",
      heading1: "CONSTRUISONS",
      heading2: "QUELQUE CHOSE.",
      fieldName: "Nom",
      fieldEmail: "Email",
      fieldMessage: "Message",
      send: "Envoyer",
      sending: "Envoi en cours…",
      sent: "Message envoyé ✓",
      tryAgain: "Réessayer",
      successToast: "Message envoyé — je vous répondrai bientôt.",
      errorMsg: "Une erreur s'est produite. Contactez-moi directement à",
      footer: "Conçu & Développé par",
      footerName: "Yohannes Bayeh",
    },
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
