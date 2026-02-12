import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";

// Google Apps Script deployment URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlIYl8HPJkqdkc93QollHkpBAZj-q8IMM5H0KOfS3o7P2-rjG-NlXFbs60nReY8lr9Ww/exec';

const RSVPSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attending: "",
    numberOfGuests: "1",
    dietaryRestrictions: "",
    essay: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('phone', formData.phone);
      params.append('attending', formData.attending);
      params.append('numberOfGuests', formData.numberOfGuests);
      params.append('dietaryRestrictions', formData.dietaryRestrictions || '');
      params.append('essay', formData.essay || '');
      params.append('timestamp', timestamp);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors'  // Required for Google Apps Script
      });

      setSubmitted(true);
      toast({
        title: t("rsvp.successTitle"),
        description: t("rsvp.successDesc"),
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        attending: "",
        numberOfGuests: "1",
        dietaryRestrictions: "",
        essay: "",
      });
    } catch (error) {
      toast({
        title: t("rsvp.errorTitle"),
        description: t("rsvp.errorDesc"),
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
    <section ref={ref} id="rsvp" className="py-16 md:py-24 px-6 md:px-12 bg-background">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">✉</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            {t("rsvp.title")}
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">
            {t("rsvp.deadline")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              {t("rsvp.fullName")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              {t("rsvp.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              {t("rsvp.phone")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-primary mb-4 font-sans font-semibold">
              {t("rsvp.attending")}
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  required
                  checked={formData.attending === "yes"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary mr-4"
                />
                <span className="text-primary font-sans text-base">{t("rsvp.yes")}</span>
              </label>
              <label className="flex items-center p-4 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  required
                  checked={formData.attending === "no"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary mr-4"
                />
                <span className="text-primary font-sans text-base">{t("rsvp.no")}</span>
              </label>
            </div>
          </div>

          {formData.attending === "yes" && (
            <>
              <div>
                <label
                  htmlFor="numberOfGuests"
                  className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
                >
                  {t("rsvp.numberOfGuests")}
                </label>
                <select
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dietaryRestrictions"
                  className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
                >
                  {t("rsvp.dietaryRestrictions")} {t("rsvp.optional")}
                </label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  placeholder={t("rsvp.dietaryPlaceholder")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="essay"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              {t("rsvp.messageLabel")} {formData.attending === "no" ? t("rsvp.required") : t("rsvp.optional")}
            </label>
            <textarea
              id="essay"
              name="essay"
              rows={4}
              required={formData.attending === "no"}
              minLength={formData.attending === "no" ? 200 : undefined}
              value={formData.essay}
              onChange={handleChange}
              placeholder={formData.attending === "no" ? t("rsvp.declinePlaceholder") : t("rsvp.messagePlaceholder")}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground resize-none"
            />
            {formData.attending === "no" && formData.essay.length > 0 && formData.essay.length < 200 && (
              <p className="text-sm text-muted-foreground mt-1">{formData.essay.length}{t("rsvp.charCount")}</p>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || submitted || !formData.attending}
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? t("rsvp.successTitle") : isSubmitting ? t("rsvp.submitting") : t("rsvp.submit")}
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-sage/20 via-rose/20 to-champagne/20 p-8 rounded-lg border border-primary/20">
            <p className="font-serif text-2xl text-foreground mb-2">
              {t("rsvp.wantMore")}
            </p>
            <p className="text-muted-foreground font-light mb-6">
              {t("rsvp.wantMoreDesc")}
            </p>
            <Link
              to="/interactive"
              className="inline-block px-8 py-3 bg-secondary text-secondary-foreground font-sans text-sm tracking-widest uppercase hover:bg-secondary/90 transition-colors duration-300 shadow-md"
            >
              {t("rsvp.funInteractive")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVPSection;
