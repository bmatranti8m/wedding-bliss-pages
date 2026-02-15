import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import couplePhoto from "@/assets/noi.webp";
import { useTranslation } from "@/i18n/LanguageContext";

const OurStorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  return (
    <section ref={ref} id="story" className="section-padding gradient-rose">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="decorative-flourish mb-4">♥</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("story.title")}
          </h2>
          <div className="decorative-line" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={couplePhoto}
                alt={t("story.imageAlt")}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <p
                key={n}
                className={
                  n === 8
                    ? "font-serif text-xl text-primary italic pt-2 text-justify"
                    : "text-muted-foreground font-light leading-relaxed text-justify"
                }
              >
                {t(`story.p${n}`)}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
