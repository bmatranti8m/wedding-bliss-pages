import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plane, Car, Hotel, Sun } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const TravelSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const items = [
    { icon: Plane, titleKey: "travel.airport.title", descKey: "travel.airport.desc" },
    { icon: Car, titleKey: "travel.transport.title", descKey: "travel.transport.desc" },
    { icon: Hotel, titleKey: "travel.stay.title", descKey: "travel.stay.desc" },
    { icon: Sun, titleKey: "travel.tip.title", descKey: "travel.tip.desc" },
  ];

  return (
    <section ref={ref} id="travel" className="py-16 md:py-24 px-6 md:px-12 gradient-rose">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="decorative-flourish mb-4">&#9992;</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("travel.title")}
          </h2>
          <div className="decorative-line mb-4" />
          <p className="text-muted-foreground font-light">
            {t("travel.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm p-8 rounded-lg border border-primary/10 shadow-sm"
            >
              <item.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {t(item.titleKey)}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelSection;
