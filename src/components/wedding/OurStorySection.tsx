import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import couplePhoto from "@/assets/we.png";

const OurStorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding gradient-rose">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="decorative-flourish mb-4">♥</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Our Love Story
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
                alt="Bogdan and Corina"
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
                How We Met
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Corina was on vacation in Zurich, Switzerland, and they went on a hike together that changed everything.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-foreground italic">
                The Proposal
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Bogdan surprised Corina during a helicopter ride over Miami Beach.
                As they soared above the sparkling turquoise waters and iconic coastline,
                he asked the question that would begin their forever — and she said yes.
              </p>
            </div>

            <div className="pt-4">
              <p className="font-serif text-xl text-primary italic">
                "In you, I've found the love of my life and my closest, truest friend."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;