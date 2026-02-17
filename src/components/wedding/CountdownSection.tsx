import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

const CountdownSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const weddingDate = new Date(2026, 5, 16, 17, 0, 0);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const isZero = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && new Date() >= weddingDate;

  const confettiPieces = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      color: ["hsl(350,30%,65%)", "hsl(140,20%,70%)", "hsl(38,50%,70%)", "#fff"][Math.floor(Math.random() * 4)],
      size: 4 + Math.random() * 8,
    })),
  []);

  const timeUnits = [
    { label: t("countdown.days"), value: timeLeft.days },
    { label: t("countdown.hours"), value: timeLeft.hours },
    { label: t("countdown.minutes"), value: timeLeft.minutes },
    { label: t("countdown.seconds"), value: timeLeft.seconds },
  ];

  return (
    <section ref={ref} id="countdown" className="section-padding gradient-sage relative overflow-hidden">
      {isZero && confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0 rounded-sm pointer-events-none"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
          }}
          animate={{ y: ["0vh", "100vh"], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)] }}
          transition={{ duration: piece.duration, delay: piece.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="decorative-flourish mb-4">∞</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("countdown.title")}
          </h2>
          <div className="decorative-line mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="bg-background/60 backdrop-blur-sm p-6 md:p-8 border border-border"
            >
              <span className="font-serif text-4xl md:text-6xl text-primary block mb-2">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground font-sans">
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 font-serif text-xl text-muted-foreground italic"
        >
          {t("countdown.untilIDo")}
        </motion.p>
      </div>
    </section>
  );
};

export default CountdownSection;
