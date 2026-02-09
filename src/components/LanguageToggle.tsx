import { useTranslation } from "@/i18n/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useTranslation();

  // Flag of the language you'll switch TO
  const targetFlag = language === "en" ? "🇷🇴" : "🇬🇧";
  const targetLabel = language === "en" ? "RO" : "EN";

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ro" : "en")}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-sans text-sm tracking-wider text-primary"
      aria-label={language === "en" ? "Schimbă în Română" : "Switch to English"}
    >
      <span className="text-lg leading-none">{targetFlag}</span>
      <span>{targetLabel}</span>
    </button>
  );
};

export default LanguageToggle;
