import { useTranslation } from "@/i18n/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ro" : "en")}
      className="fixed top-6 right-6 z-50 flex items-center gap-1 px-4 py-2 bg-white/90 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-sans text-sm tracking-wider text-primary"
      aria-label={language === "en" ? "Schimbă în Română" : "Switch to English"}
    >
      <span className={`text-lg leading-none ${language === "en" ? "" : "opacity-50"}`}>🇬🇧</span>
      <span className={language === "en" ? "underline underline-offset-4 font-semibold" : "opacity-60"}>EN</span>
      <span className="opacity-40">|</span>
      <span className={`text-lg leading-none ${language === "ro" ? "" : "opacity-50"}`}>🇷🇴</span>
      <span className={language === "ro" ? "underline underline-offset-4 font-semibold" : "opacity-60"}>RO</span>
    </button>
  );
};

export default LanguageToggle;
