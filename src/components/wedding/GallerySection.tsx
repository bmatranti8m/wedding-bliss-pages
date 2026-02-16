import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

import img0423 from "@/assets/IMG_0423.webp";
import img1092 from "@/assets/IMG_1092.webp";
import img1344 from "@/assets/IMG_1344.webp";
import img1360 from "@/assets/IMG_1360.webp";
import img1830 from "@/assets/IMG_1830.webp";
import img2250 from "@/assets/IMG_2250.webp";
import img2770 from "@/assets/IMG_2770.webp";
import img2879 from "@/assets/IMG_2879.webp";
import img2954 from "@/assets/IMG_2954.webp";
import img4615 from "@/assets/IMG_4615.webp";
import img6063 from "@/assets/IMG_6063.webp";
import img6360 from "@/assets/IMG_6360.webp";
import img6519 from "@/assets/IMG_6519.webp";
import img6796 from "@/assets/IMG_6796.webp";
import img6964 from "@/assets/IMG_6964.webp";
import img7250 from "@/assets/IMG_7250.webp";
import img7303 from "@/assets/IMG_7303.webp";
import img7529 from "@/assets/IMG_7529.webp";
import img7944 from "@/assets/IMG_7944.webp";
import img8397 from "@/assets/IMG_8397.webp";
import img8586 from "@/assets/IMG_8586.webp";
import img9035 from "@/assets/IMG_9035.webp";
import img9414 from "@/assets/IMG_9414.webp";

const images = [
  img0423, img1092, img1344, img1360, img1830, img2250, img2770,
  img2879, img2954, img4615, img6063, img6360, img6519, img6796,
  img6964, img7250, img7303, img7529, img7944, img8397, img8586,
  img9035, img9414,
];

function calculateSlideOffset(index: number, progress: number, totalSlides: number): number {
  const rawOffset = index - progress * totalSlides;
  // Handle loop wraparound: find the shortest distance
  let offset = rawOffset % totalSlides;
  if (offset > totalSlides / 2) offset -= totalSlides;
  if (offset < -totalSlides / 2) offset += totalSlides;
  return offset;
}

function getSlideTransform(offset: number) {
  const absOffset = Math.abs(offset);
  const rotateY = -offset * 45;
  const scale = Math.max(0.4, 1 - absOffset * 0.2);
  const opacity = Math.max(0.2, 1 - absOffset * 0.35);
  const translateZ = -absOffset * 150;
  const zIndex = 10 - Math.round(absOffset);
  return { rotateY, scale, opacity, translateZ, zIndex };
}

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSlideTransforms = useCallback((progress: number) => {
    const total = images.length;
    slidesRef.current.forEach((el, i) => {
      if (!el) return;
      const offset = calculateSlideOffset(i, progress, total);
      const { rotateY, scale, opacity, translateZ, zIndex } = getSlideTransform(offset);
      el.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(zIndex);
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onScroll = () => updateSlideTransforms(emblaApi.scrollProgress());
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    onScroll(); // initialize
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi, updateSlideTransforms]);

  return (
    <section ref={ref} id="gallery" className="py-16 md:py-24 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">&#10084;</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("gallery.title")}
          </h2>
          <div className="decorative-line mb-4" />
          <p className="text-muted-foreground font-light">
            {t("gallery.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-lg" ref={emblaRef} style={{ perspective: "2000px" }}>
            <div className="flex" style={{ transformStyle: "preserve-3d" }}>
              {images.map((src, i) => (
                <div
                  key={i}
                  ref={(el) => { slidesRef.current[i] = el; }}
                  className="flex-[0_0_85%] md:flex-[0_0_60%] min-w-0 px-2 will-change-transform"
                >
                  <div className="aspect-[9/10] overflow-hidden rounded-lg shadow-xl">
                    <img
                      src={src}
                      alt={`Gallery photo ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:translate-x-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:-translate-x-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-primary/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
