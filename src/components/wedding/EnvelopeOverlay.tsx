import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import envelopeImage from "@/assets/envelope.webp";
import oceanVideo from "@/assets/ocean.mp4";
import wavesAudio from "@/assets/waves.mp3";
import { useTranslation } from "@/i18n/LanguageContext";

const EnvelopeOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioKey, setAudioKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setIsVisible(true);
    setAudioPlaying(false);
    setAudioKey(Date.now());

    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setAudioPlaying(true))
          .catch(() => {});
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const startAudio = useCallback(() => {
    if (audioRef.current && !audioPlaying) {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch(() => {});
    }
  }, [audioPlaying]);

  const handleClick = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    // Play opening animation, then dismiss
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsVisible(false);
    }, 800);
  }, [isOpening]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={startAudio}
          onTouchStart={startAudio}
          role="button"
          tabIndex={0}
          aria-label={t("envelope.tapToOpen")}
        >
          {/* Waves Audio */}
          <audio key={audioKey} ref={audioRef} loop>
            <source src={wavesAudio} type="audio/mpeg" />
          </audio>

          {/* Fullscreen Ocean Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={oceanVideo} type="video/mp4" />
          </video>

          {/* Dark overlay for better envelope visibility */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Envelope Image */}
          <motion.img
            src={envelopeImage}
            alt={t("envelope.tapToOpen")}
            className="relative z-10 max-w-[60%] max-h-[60vh] object-contain"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isOpening
              ? { scale: 1.15, opacity: 0, rotateX: -30, y: -40 }
              : { scale: 1, opacity: 1 }
            }
            transition={isOpening
              ? { duration: 0.8, ease: "easeInOut" }
              : { duration: 0.8, ease: "easeOut" }
            }
            whileHover={!isOpening ? { scale: 1.02 } : undefined}
            whileTap={!isOpening ? { scale: 0.98 } : undefined}
            style={{ perspective: 800 }}
          />

          {/* Tap hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 text-center z-10"
          >
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white font-sans font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t("envelope.tapToOpen")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeOverlay;
