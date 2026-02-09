import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SongRequestsSection from "@/components/wedding/SongRequestsSection";
import AdviceSection from "@/components/wedding/AdviceSection";
import PredictionsSection from "@/components/wedding/PredictionsSection";
import FooterSection from "@/components/wedding/FooterSection";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";

const Interactive = () => {
  const [guestName, setGuestName] = useState("");
  const { t } = useTranslation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header with back button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="font-sans text-sm uppercase tracking-widest">{t("interactive.backToWedding")}</span>
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl text-primary">
            {t("interactive.title")}
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </motion.div>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        {/* Guest Name Section */}
        <section className="section-padding bg-background">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <p className="decorative-flourish mb-4">✨</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-4">
                {t("interactive.welcome")}
              </h2>
              <div className="decorative-line mb-6" />
              <p className="text-muted-foreground font-light mb-8">
                {t("interactive.letUsKnow")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <label
                htmlFor="guestName"
                className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
              >
                {t("interactive.yourName")}
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                placeholder={t("interactive.namePlaceholder")}
                className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
              />
              <div className="h-12 mt-4">
                {guestName && (
                  <p className="text-center text-muted-foreground font-light">
                    {t("interactive.thanks", { name: guestName })}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <SongRequestsSection guestName={guestName} />
        <AdviceSection guestName={guestName} />
        <PredictionsSection guestName={guestName} />
        <FooterSection />
      </div>
    </main>
  );
};

export default Interactive;
