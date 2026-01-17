import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const CountdownSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const weddingDate = new Date("2026-06-16T17:00:00");
  
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
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section ref={ref} className="section-padding gradient-sage">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="decorative-flourish mb-4">∞</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Counting Down to Forever
          </h2>
          <div className="decorative-line mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {timeUnits.map((unit, index) => (
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
          Until we say "I do"
        </motion.p>
      </div>
    </section>
  );
};

export default CountdownSection;