import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PhotoUploadSection from "@/components/wedding/PhotoUploadSection";
import FooterSection from "@/components/wedding/FooterSection";
import { useTranslation } from "@/i18n/LanguageContext";

const Upload = () => {
  const { t } = useTranslation();

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
            <span className="font-sans text-sm uppercase tracking-widest">
              {t("interactive.backToWedding")}
            </span>
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl text-primary">
            {t("photos.title")}
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </motion.div>

      <div className="pt-20">
        <PhotoUploadSection />
        <FooterSection />
      </div>
    </main>
  );
};

export default Upload;
