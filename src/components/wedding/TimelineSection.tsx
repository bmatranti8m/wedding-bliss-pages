import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img0528 from "@/assets/IMG_0528.webp";
import img1868 from "@/assets/IMG_6501.webp";
import img7239 from "@/assets/IMG_7239.webp";
import img2214 from "@/assets/IMG_2214.webp";
import img2225 from "@/assets/IMG_2225.webp";
import wePhoto from "@/assets/we.webp";
import img5385 from "@/assets/IMG_5385.webp";
import img5543 from "@/assets/IMG_5543.webp";
import img5821 from "@/assets/IMG_5821.webp";
import img5952 from "@/assets/IMG_5952.webp";
import couplePhoto from "@/assets/couple-photo.webp";
import { useTranslation } from "@/i18n/LanguageContext";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  images: string[];
  position: "left" | "right";
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  aspect?: string;
}

const TimelineCarousel = ({ event }: { event: TimelineEvent }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const hasMultiple = event.images.length > 1;

  if (!hasMultiple) {
    return (
      <div className={`${event.aspect || "aspect-[4/3]"} overflow-hidden rounded-lg shadow-xl relative group`}>
        <img
          src={event.images[0]}
          alt={event.title}
          loading="lazy"
          className={`w-full h-full ${event.objectFit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-110`}
          style={event.objectPosition ? { objectPosition: event.objectPosition } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${event.aspect || "aspect-[4/3]"} overflow-hidden rounded-lg shadow-xl`} ref={emblaRef}>
        <div className="flex h-full">
          {event.images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <img
                src={src}
                alt={`${event.title} ${i + 1}`}
                loading="lazy"
                className={`w-full h-full ${event.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                style={event.objectPosition ? { objectPosition: event.objectPosition } : undefined}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Next photo"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>
      <div className="flex justify-center gap-1.5 mt-2">
        {event.images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

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
              <TimelineCarousel event={event} />
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
              <TimelineCarousel event={event} />
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
      images: [img0528],
      position: "left",
      aspect: "aspect-[3/4]",
      objectPosition: "center top",
    },
    {
      date: t("timeline.event2.date"),
      title: t("timeline.event2.title"),
      description: t("timeline.event2.desc"),
      images: [img1868],
      position: "right",
      aspect: "aspect-[3/4]",
      objectPosition: "center top",
    },
    {
      date: t("timeline.event3.date"),
      title: t("timeline.event3.title"),
      description: t("timeline.event3.desc"),
      images: [img7239, img2214, img2225],
      position: "left",
      aspect: "aspect-[3/4]",
      objectPosition: "center top",
    },
    {
      date: t("timeline.event4.date"),
      title: t("timeline.event4.title"),
      description: t("timeline.event4.desc"),
      images: [img5385, img5543, img5821, img5952],
      position: "right",
      aspect: "aspect-[3/4]",
      objectPosition: "center top",
    },
    {
      date: t("timeline.event5.date"),
      title: t("timeline.event5.title"),
      description: t("timeline.event5.desc"),
      images: [wePhoto],
      position: "left",
      aspect: "aspect-[3/4]",
      objectPosition: "center top",
    },
    {
      date: t("timeline.event6.date"),
      title: t("timeline.event6.title"),
      description: t("timeline.event6.desc"),
      images: [couplePhoto],
      position: "right",
      aspect: "aspect-[3/4]",
      objectPosition: "center top",
    },
  ];

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
          {/* Dotted line connecting all pins to heart */}
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[6px] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 3px, transparent 3px)",
              backgroundSize: "6px 24px",
              backgroundPosition: "center top",
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isInView ? { scaleY: 1, opacity: 0.6 } : {}}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />

          {timelineEvents.map((event, index) => (
            <TimelineItem key={index} event={event} index={index} />
          ))}

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
      </div>
    </section>
  );
};

export default TimelineSection;
