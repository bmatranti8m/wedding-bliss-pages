import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import couplePhoto from "@/assets/we.png";
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
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-foreground italic">
                {t("story.howWeMet")}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {t("story.howWeMetDesc")}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-foreground italic">
                {t("story.proposal")}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {t("story.proposalDesc")}
              </p>
            </div>

            <div className="pt-4">
              <p className="font-serif text-xl text-primary italic">
                {t("story.quote")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
