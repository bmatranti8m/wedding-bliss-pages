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
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PollQuestion = ({ question, name, options, value, onChange }: PollQuestionProps) => (
  <div className="bg-white/70 p-6 rounded-lg">
    <p className="font-serif text-xl text-foreground mb-4">{question}</p>
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option} className="flex items-center p-3 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors rounded">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
            required
            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary mr-3"
          />
          <span className="text-primary font-sans">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

interface TextQuestionProps {
  question: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextQuestion = ({ question, name, value, placeholder, onChange }: TextQuestionProps) => (
  <div className="bg-white/70 p-6 rounded-lg">
    <p className="font-serif text-xl text-foreground mb-4">{question}</p>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 bg-white border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-primary font-sans"
    />
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
    cakeSmash: "",
    lastOnDanceFloor: "",
    aperolSpritzes: "",
    speakItalian: "",
    firstKiss: "",
    firstDanceSong: "",
    brideLate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toLocaleDateString('ro-RO');
      const params = new URLSearchParams();
      params.append('guestName', guestName);
      params.append('criesFirst', formData.criesFirst);
      params.append('betterDancer', formData.betterDancer);
      params.append('cakeSmash', formData.cakeSmash);
      params.append('lastOnDanceFloor', formData.lastOnDanceFloor);
      params.append('aperolSpritzes', formData.aperolSpritzes);
      params.append('speakItalian', formData.speakItalian);
      params.append('firstKiss', formData.firstKiss);
      params.append('firstDanceSong', formData.firstDanceSong);
      params.append('brideLate', formData.brideLate);
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
        cakeSmash: "",
        lastOnDanceFloor: "",
        aperolSpritzes: "",
        speakItalian: "",
        firstKiss: "",
        firstDanceSong: "",
        brideLate: "",
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

  const q3Options = [t("predictions.q3o1"), t("predictions.q3o2"), t("predictions.q3o3")];
  const q4Options = [t("predictions.q4o1"), t("predictions.q4o2"), t("predictions.q4o3"), t("predictions.q4o4"), t("predictions.q4o5")];
  const q5Options = [t("predictions.q5o1"), t("predictions.q5o2"), t("predictions.q5o3")];
  const q6Options = [t("predictions.q6o1"), t("predictions.q6o2"), t("predictions.q6o3")];
  const q7Options = [t("predictions.q7o1"), t("predictions.q7o2"), t("predictions.q7o3")];

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
            options={["Bogdan", "Corina"]}
            value={formData.criesFirst}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q2")}
            name="betterDancer"
            options={["Bogdan", "Corina"]}
            value={formData.betterDancer}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q3")}
            name="cakeSmash"
            options={q3Options}
            value={formData.cakeSmash}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q4")}
            name="lastOnDanceFloor"
            options={q4Options}
            value={formData.lastOnDanceFloor}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q5")}
            name="aperolSpritzes"
            options={q5Options}
            value={formData.aperolSpritzes}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q6")}
            name="speakItalian"
            options={q6Options}
            value={formData.speakItalian}
            onChange={handleChange}
          />

          <PollQuestion
            question={t("predictions.q7")}
            name="firstKiss"
            options={q7Options}
            value={formData.firstKiss}
            onChange={handleChange}
          />

          <TextQuestion
            question={t("predictions.q8")}
            name="firstDanceSong"
            value={formData.firstDanceSong}
            placeholder={t("predictions.q8placeholder")}
            onChange={handleChange}
          />

          <TextQuestion
            question={t("predictions.q9")}
            name="brideLate"
            value={formData.brideLate}
            placeholder={t("predictions.q9placeholder")}
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
