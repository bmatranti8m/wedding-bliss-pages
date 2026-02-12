import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import wavesAudio from "@/assets/waves.mp3";
import { useTranslation } from "@/i18n/LanguageContext";

const MusicToggle = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    audioRef.current = new Audio(wavesAudio);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? t("music.pause") : t("music.play")}
      className="fixed bottom-4 left-4 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-primary/20"
    >
      {playing ? (
        <Volume2 className="w-4 h-4 text-primary" />
      ) : (
        <VolumeX className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
};

export default MusicToggle;
