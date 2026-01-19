import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import envelopeImage from "@/assets/envelope.png";
import oceanVideo from "@/assets/ocean.mp4";
import wavesAudio from "@/assets/waves.mp3";

const EnvelopeOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioKey, setAudioKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reset state on mount and force audio element recreation
    setIsVisible(true);
    setAudioPlaying(false);
    setAudioKey(Date.now()); // Force new audio element

    // Small delay to ensure audio element is ready
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.load(); // Force reload the audio
        audioRef.current.play()
          .then(() => {
            setAudioPlaying(true);
          })
          .catch((error) => {
            // Autoplay blocked - will play on first interaction
            console.log("Audio autoplay prevented:", error);
          });
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const startAudio = () => {
    // Start audio on interaction if not already playing
    if (audioRef.current && !audioPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch((error) => {
          console.log("Audio play failed:", error);
        });
    }
  };

  const handleEnvelopeClick = () => {
    // Try to start audio first if not playing
    if (!audioPlaying) {
      startAudio();
      // Don't dismiss yet - wait for next click
      return;
    }

    // Fade out and stop audio on second click
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          onClick={handleEnvelopeClick}
          onMouseEnter={startAudio}
          onTouchStart={startAudio}
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
            alt="Click to open"
            className="relative z-10 max-w-[60%] max-h-[60vh] object-contain"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          />

          {/* Tap hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 text-center z-10"
          >
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white font-sans font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {audioPlaying ? "Tap to open" : "Tap to start"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeOverlay;
