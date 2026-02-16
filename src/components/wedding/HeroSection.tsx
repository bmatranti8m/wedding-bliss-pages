import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import couplePhoto from "@/assets/couple-photo.webp";
import { useTranslation } from "@/i18n/LanguageContext";

const generateICS = () => {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bogdan & Corina Wedding//EN
BEGIN:VEVENT
DTSTART:20260616T170000
DTEND:20260617T010000
SUMMARY:Bogdan & Corina Wedding
LOCATION:Grand Hotel Villa Parisi, Via Romolo Monti 10, Castiglioncello, Italy
DESCRIPTION:Join us for our wedding celebration by the sea in Castiglioncello!
END:VEVENT
END:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bogdan-corina-wedding.ics";
  a.click();
  URL.revokeObjectURL(url);
};

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${couplePhoto})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-base tracking-[0.3em] uppercase text-white mb-6 font-sans font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {t("hero.gettingMarried")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-4 italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
        >
          Bogdan <span className="text-primary drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">&</span> Corina
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-24 h-px bg-primary mx-auto my-8 shadow-lg"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="font-serif text-2xl md:text-3xl text-white font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
        >
          {t("hero.date")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-white mt-4 font-sans font-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {t("hero.venue")}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          onClick={generateICS}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-sans text-sm tracking-wider uppercase hover:bg-white/30 transition-colors rounded-full"
        >
          <CalendarPlus className="w-4 h-4" />
          {t("hero.saveTheDate")}
        </motion.button>
      </div>

      {/* RSVP Button - Heart Shape */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Heart-shaped ripple animations */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            animate={{
              scale: [1, 1.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <path
              d="M50,85 C50,85 20,60 20,40 C20,25 30,20 40,25 C45,27.5 50,32.5 50,32.5 C50,32.5 55,27.5 60,25 C70,20 80,25 80,40 C80,60 50,85 50,85 Z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </motion.svg>
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            animate={{
              scale: [1, 1.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          >
            <path
              d="M50,85 C50,85 20,60 20,40 C20,25 30,20 40,25 C45,27.5 50,32.5 50,32.5 C50,32.5 55,27.5 60,25 C70,20 80,25 80,40 C80,60 50,85 50,85 Z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </motion.svg>
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            animate={{
              scale: [1, 1.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1,
            }}
          >
            <path
              d="M50,85 C50,85 20,60 20,40 C20,25 30,20 40,25 C45,27.5 50,32.5 50,32.5 C50,32.5 55,27.5 60,25 C70,20 80,25 80,40 C80,60 50,85 50,85 Z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </motion.svg>

          {/* Heart-shaped Button */}
          <motion.a
            href="#rsvp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group cursor-pointer"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-28 h-28 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {/* Heart shape */}
              <path
                d="M50,85 C50,85 20,60 20,40 C20,25 30,20 40,25 C45,27.5 50,32.5 50,32.5 C50,32.5 55,27.5 60,25 C70,20 80,25 80,40 C80,60 50,85 50,85 Z"
                fill="hsl(var(--primary))"
                className="transition-all duration-300 group-hover:fill-primary/90"
              />
            </svg>
            {/* Text centered in heart */}
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <span className="text-white font-sans text-sm tracking-widest uppercase font-medium">
                {t("hero.rsvp")}
              </span>
            </div>
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="animate-float">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
