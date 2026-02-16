import { useTranslation } from "@/i18n/LanguageContext";

const GBFlag = () => (
  <svg viewBox="0 0 60 30" className="w-5 h-3 rounded-sm" aria-hidden="true">
    <clipPath id="gb"><path d="M0 0v30h60V0z"/></clipPath>
    <g clipPath="url(#gb)">
      <path d="M0 0v30h60V0z" fill="#012169"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb)"/>
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const ROFlag = () => (
  <svg viewBox="0 0 6 4" className="w-5 h-3 rounded-sm" aria-hidden="true">
    <rect width="2" height="4" fill="#002B7F"/>
    <rect x="2" width="2" height="4" fill="#FCD116"/>
    <rect x="4" width="2" height="4" fill="#CE1126"/>
  </svg>
);

const LanguageToggle = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ro" : "en")}
      className="fixed top-6 right-6 z-50 flex items-center gap-1 px-4 py-2 bg-white/90 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-sans text-sm tracking-wider text-primary"
      aria-label={language === "en" ? "Schimbă în Română" : "Switch to English"}
    >
      <span className={language === "en" ? "" : "opacity-50"}><GBFlag /></span>
      <span className={language === "en" ? "underline underline-offset-4 font-semibold" : "opacity-60"}>EN</span>
      <span className="opacity-40">|</span>
      <span className={language === "ro" ? "" : "opacity-50"}><ROFlag /></span>
      <span className={language === "ro" ? "underline underline-offset-4 font-semibold" : "opacity-60"}>RO</span>
    </button>
  );
};

export default LanguageToggle;
