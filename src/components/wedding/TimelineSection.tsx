import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import img0528 from "@/assets/IMG_0528.jpg";
import img1868 from "@/assets/IMG_1868.jpg";
import img7239 from "@/assets/IMG_7239.jpg";
import wePhoto from "@/assets/we.png";
import img5385 from "@/assets/IMG_5385.jpg";
import couplePhoto from "@/assets/couple-photo.jpg";
import { useTranslation } from "@/i18n/LanguageContext";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  image: string;
  position: "left" | "right";
  objectFit?: "cover" | "contain";
}

const TimelineItem = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative mb-16 md:mb-32">
      {/* Unified layout for mobile and desktop */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-start">
        {/* Left side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-end"
        >
          {event.position === "left" ? (
            <div className="w-full">
              <div className="bg-white/80 backdrop-blur-sm p-3 md:p-6 rounded-lg shadow-lg border border-rose/20">
                <p className="text-primary font-serif italic text-sm md:text-lg mb-1 md:mb-2">
                  {event.date}
                </p>
                <h3 className="font-serif text-lg md:text-3xl text-foreground mb-2 md:mb-3">
                  {event.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-xs md:text-base">
                  {event.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl relative group">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className={`w-full h-full ${event.objectFit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Center pin */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative flex justify-center pt-2 md:pt-6"
        >
          <div className="relative flex flex-col items-center">
            {/* Milestone marker */}
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-primary border-2 md:border-4 border-white shadow-lg flex items-center justify-center shrink-0 relative z-10">
              <div className="w-4 h-4 md:w-8 md:h-8 rounded-full bg-white" />
            </div>
          </div>
        </motion.div>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-start"
        >
          {event.position === "right" ? (
            <div className="w-full">
              <div className="bg-white/80 backdrop-blur-sm p-3 md:p-6 rounded-lg shadow-lg border border-rose/20">
                <p className="text-primary font-serif italic text-sm md:text-lg mb-1 md:mb-2">
                  {event.date}
                </p>
                <h3 className="font-serif text-lg md:text-3xl text-foreground mb-2 md:mb-3">
                  {event.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-xs md:text-base">
                  {event.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl relative group">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className={`w-full h-full ${event.objectFit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const timelineEvents: TimelineEvent[] = [
    {
      date: t("timeline.event1.date"),
      title: t("timeline.event1.title"),
      description: t("timeline.event1.desc"),
      image: img0528,
      position: "left",
    },
    {
      date: t("timeline.event2.date"),
      title: t("timeline.event2.title"),
      description: t("timeline.event2.desc"),
      image: img1868,
      position: "right",
    },
    {
      date: t("timeline.event3.date"),
      title: t("timeline.event3.title"),
      description: t("timeline.event3.desc"),
      image: img7239,
      position: "left",
    },
    {
      date: t("timeline.event4.date"),
      title: t("timeline.event4.title"),
      description: t("timeline.event4.desc"),
      image: img5385,
      position: "right",
      objectFit: "contain",
    },
    {
      date: t("timeline.event5.date"),
      title: t("timeline.event5.title"),
      description: t("timeline.event5.desc"),
      image: wePhoto,
      position: "left",
    },
    {
      date: t("timeline.event6.date"),
      title: t("timeline.event6.title"),
      description: t("timeline.event6.desc"),
      image: couplePhoto,
      position: "right",
    },
  ];

  // Generate straight path dynamically
  const generateStraightPath = () => {
    const center = 100; // Center X position
    const startY = 40; // Starting Y position (first pin, adjusted for mobile)

    // Calculate spacing based on actual layout
    // Mobile: smaller elements, ~380px between pins
    // Desktop: larger elements, ~520px between pins
    const spacing = 520; // Desktop spacing (mobile handled by responsive margins)

    // Calculate Y position of last pin
    const lastPinY = startY + (timelineEvents.length - 1) * spacing;

    // Heart is positioned shortly after the last pin - stop at the heart
    const finalY = lastPinY + 60; // Extend to reach the heart center

    // Simple straight line from first pin through all pins to heart
    return `M ${center} ${startY} L ${center} ${finalY}`;
  };

  const totalHeight = (timelineEvents.length - 1) * 520 + 300;

  return (
    <section ref={ref} id="timeline" className="section-padding gradient-sage relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-32"
        >
          <p className="decorative-flourish mb-4">♥</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("timeline.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("timeline.subtitle")}
          </p>
          <div className="decorative-line mt-6" />
        </motion.div>

        {/* Timeline events */}
        <div className="relative">
          {/* Straight dotted path connecting all pins */}
          <svg
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[200px] h-full pointer-events-none"
            style={{ height: `${totalHeight}px` }}
            viewBox={`0 0 200 ${totalHeight}`}
            preserveAspectRatio="xMidYMin meet"
          >
            <motion.path
              d={generateStraightPath()}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="12 12"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
          </svg>

          {timelineEvents.map((event, index) => (
            <TimelineItem key={index} event={event} index={index} />
          ))}
        </div>

        {/* End of timeline marker */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex justify-center mt-10"
        >
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-accent border-2 md:border-4 border-white shadow-2xl flex items-center justify-center relative z-10">
            <span className="text-xl md:text-2xl">💕</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;
