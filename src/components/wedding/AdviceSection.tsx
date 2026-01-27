import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Replace with your Google Apps Script deployment URL for advice
const ADVICE_URL = 'https://script.google.com/macros/s/AKfycbwQBwMxSt7ZFJgXkqMdezNbxDDQRJ7m_uW-4CWL9zfvfyNMVzI5kgB30fTxIfwUKLYX/exec';

interface AdviceSectionProps {
  guestName: string;
}

const AdviceSection = ({ guestName }: AdviceSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    adviceType: "",
    advice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const params = new URLSearchParams();
      params.append('guestName', guestName);
      params.append('adviceType', formData.adviceType);
      params.append('advice', formData.advice);
      params.append('timestamp', timestamp);

      await fetch(ADVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors'
      });

      toast({
        title: "Thank You!",
        description: "Your advice means the world to us!",
      });
      setFormData({
        adviceType: "",
        advice: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section ref={ref} className="section-padding gradient-rose">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">♥</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Advice for the Newlyweds
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">
            Share your wisdom, favorite date ideas, or marriage tips!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
        >

          <div>
            <label
              htmlFor="adviceType"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              Type of Advice
            </label>
            <select
              id="adviceType"
              name="adviceType"
              required
              value={formData.adviceType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
            >
              <option value="">Choose one...</option>
              <option value="Marriage Advice">Marriage Advice</option>
              <option value="Date Night Idea">Date Night Idea</option>
              <option value="Life Tip">Life Tip</option>
              <option value="Words of Wisdom">Words of Wisdom</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="advice"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              Your Advice
            </label>
            <textarea
              id="advice"
              name="advice"
              rows={5}
              required
              value={formData.advice}
              onChange={handleChange}
              placeholder="Share your wisdom with the happy couple..."
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground resize-none"
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !guestName}
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sharing...' : !guestName ? 'Enter Your Name Above First' : 'Share Your Advice'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default AdviceSection;
