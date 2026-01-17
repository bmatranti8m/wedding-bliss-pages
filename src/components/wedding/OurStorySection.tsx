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
                It was a rainy afternoon in London when our paths crossed at a cozy bookshop in Notting Hill.
                Bogdan was searching for a first edition, and Corina was lost in the poetry section.
                A shared umbrella later, and the rest, as they say, is history.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-foreground italic">
                The Proposal
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Two years later, Bogdan surprised Corina during a sunset picnic at the very spot
                where they shared their first kiss. With the city skyline as our witness and
                hearts full of love, Corina said yes under a canopy of fairy lights.
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