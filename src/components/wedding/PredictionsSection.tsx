import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Replace with your Google Apps Script deployment URL for predictions
const PREDICTIONS_URL = 'YOUR_PREDICTIONS_SCRIPT_URL';

interface PredictionsSectionProps {
  guestName: string;
}

const PredictionsSection = ({ guestName }: PredictionsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    criesFirst: "",
    betterDancer: "",
    wakesEarlier: "",
    betterCook: "",
    moreRomantic: "",
    saysILoveYouFirst: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const params = new URLSearchParams();
      params.append('guestName', guestName);
      params.append('criesFirst', formData.criesFirst);
      params.append('betterDancer', formData.betterDancer);
      params.append('wakesEarlier', formData.wakesEarlier);
      params.append('betterCook', formData.betterCook);
      params.append('moreRomantic', formData.moreRomantic);
      params.append('saysILoveYouFirst', formData.saysILoveYouFirst);
      params.append('timestamp', timestamp);

      await fetch(PREDICTIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors'
      });

      toast({
        title: "Predictions Recorded!",
        description: "We'll see how accurate you are!",
      });
      setFormData({
        criesFirst: "",
        betterDancer: "",
        wakesEarlier: "",
        betterCook: "",
        moreRomantic: "",
        saysILoveYouFirst: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const PollQuestion = ({
    question,
    name,
    option1,
    option2
  }: {
    question: string;
    name: string;
    option1: string;
    option2: string;
  }) => (
    <div className="bg-white/70 p-6 rounded-lg">
      <p className="font-serif text-xl text-foreground mb-4">{question}</p>
      <div className="space-y-3">
        <label className="flex items-center p-3 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors rounded">
          <input
            type="radio"
            name={name}
            value={option1}
            checked={formData[name as keyof typeof formData] === option1}
            onChange={handleChange}
            required
            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary mr-3"
          />
          <span className="text-primary font-sans">{option1}</span>
        </label>
        <label className="flex items-center p-3 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors rounded">
          <input
            type="radio"
            name={name}
            value={option2}
            checked={formData[name as keyof typeof formData] === option2}
            onChange={handleChange}
            required
            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary mr-3"
          />
          <span className="text-primary font-sans">{option2}</span>
        </label>
      </div>
    </div>
  );

  return (
    <section ref={ref} className="section-padding bg-champagne/20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">✨</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Predictions Poll
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">
            Make your predictions about Bogdan & Corina!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          <PollQuestion
            question="Who will cry first during the ceremony?"
            name="criesFirst"
            option1="Bogdan"
            option2="Corina"
          />

          <PollQuestion
            question="Who's the better dancer?"
            name="betterDancer"
            option1="Bogdan"
            option2="Corina"
          />

          <PollQuestion
            question="Who wakes up earlier?"
            name="wakesEarlier"
            option1="Bogdan"
            option2="Corina"
          />

          <PollQuestion
            question="Who's the better cook?"
            name="betterCook"
            option1="Bogdan"
            option2="Corina"
          />

          <PollQuestion
            question="Who's more romantic?"
            name="moreRomantic"
            option1="Bogdan"
            option2="Corina"
          />

          <PollQuestion
            question="Who says 'I love you' first each day?"
            name="saysILoveYouFirst"
            option1="Bogdan"
            option2="Corina"
          />

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !guestName}
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? 'Submitting...' : !guestName ? 'Enter Your Name Above First' : 'Submit Predictions'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default PredictionsSection;
