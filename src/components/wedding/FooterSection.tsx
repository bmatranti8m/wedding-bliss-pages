import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="section-padding gradient-rose border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="font-serif text-6xl md:text-8xl text-primary mb-8 italic">
            E <span className="text-muted-foreground">&</span> J
          </div>
          
          <p className="font-serif text-2xl text-foreground mb-4 italic">
            We can't wait to celebrate with you!
          </p>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
            <span className="h-px w-12 bg-border" />
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="h-px w-12 bg-border" />
          </div>
          
          <div className="space-y-2 text-muted-foreground font-sans text-sm font-light">
            <p>For questions or travel assistance, please contact:</p>
            <p className="text-foreground">hello@emmaandjames.love</p>
          </div>
          
          <p className="mt-12 text-xs text-muted-foreground font-sans tracking-wider">
            #EmmaAndJamesForever
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;