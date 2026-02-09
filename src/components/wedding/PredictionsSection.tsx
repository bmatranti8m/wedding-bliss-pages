import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/LanguageContext";

// Replace with your Google Apps Script deployment URL for predictions
const PREDICTIONS_URL = 'https://script.google.com/macros/s/AKfycbwQBwMxSt7ZFJgXkqMdezNbxDDQRJ7m_uW-4CWL9zfvfyNMVzI5kgB30fTxIfwUKLYX/exec';

interface PredictionsSectionProps {
  guestName: string;
}

interface PollQuestionProps {
  question: string;
  name: string;
  option1: string;
  option2: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PollQuestion = ({ question, name, option1, option2, value, onChange }: PollQuestionProps) => (
  <div className="bg-white/70 p-6 rounded-lg">
    <p className="font-serif text-xl text-foreground mb-4">{question}</p>
    <div className="space-y-3">
      <label className="flex items-center p-3 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors rounded">
        <input
          type="radio"
          name={name}
          value={option1}
          checked={value === option1}
          onChange={onChange}
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
          checked={value === option2}
          onChange={onChange}
          required
          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary mr-3"
        />
        <span className="text-primary font-sans">{option2}</span>
      </label>
    </div>
  </div>
);

const PredictionsSection = ({ guestName }: PredictionsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t("predictions.successTitle"),
        description: t("predictions.successDesc"),
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
        title: t("shared.submissionFailed"),
        description: t("shared.tryAgainLater"),
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
            {t("predictions.title")}
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">
            {t("predictions.subtitle")}
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
            question={t("predictions.q1")}
            name="criesFirst"
            option1="Bogdan"
            option2="Corina"
            value={formData.criesFirst}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q2")}
            name="betterDancer"
            option1="Bogdan"
            option2="Corina"
            value={formData.betterDancer}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q3")}
            name="wakesEarlier"
            option1="Bogdan"
            option2="Corina"
            value={formData.wakesEarlier}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q4")}
            name="betterCook"
            option1="Bogdan"
            option2="Corina"
            value={formData.betterCook}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q5")}
            name="moreRomantic"
            option1="Bogdan"
            option2="Corina"
            value={formData.moreRomantic}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q6")}
            name="saysILoveYouFirst"
            option1="Bogdan"
            option2="Corina"
            value={formData.saysILoveYouFirst}
            onChange={handleChange}
          />

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !guestName}
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? t("predictions.submitting") : !guestName ? t("predictions.enterName") : t("predictions.submit")}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default PredictionsSection;
