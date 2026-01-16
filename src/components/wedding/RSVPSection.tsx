import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RSVPSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "",
    guests: "1",
    dietaryRestrictions: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "RSVP Received!",
      description: "Thank you for responding. We can't wait to celebrate with you!",
    });
    setFormData({
      name: "",
      email: "",
      attending: "",
      guests: "1",
      dietaryRestrictions: "",
      message: "",
    });
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
    <section ref={ref} id="rsvp" className="section-padding bg-background">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">✉</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            RSVP
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">
            Please respond by May 1, 2025
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm uppercase tracking-widest text-muted-foreground mb-2 font-sans"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm uppercase tracking-widest text-muted-foreground mb-2 font-sans"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="attending"
                className="block text-sm uppercase tracking-widest text-muted-foreground mb-2 font-sans"
              >
                Will you attend?
              </label>
              <select
                id="attending"
                name="attending"
                required
                value={formData.attending}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
              >
                <option value="">Select...</option>
                <option value="yes">Joyfully Accept</option>
                <option value="no">Regretfully Decline</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="guests"
                className="block text-sm uppercase tracking-widest text-muted-foreground mb-2 font-sans"
              >
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="dietaryRestrictions"
              className="block text-sm uppercase tracking-widest text-muted-foreground mb-2 font-sans"
            >
              Dietary Restrictions
            </label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
              placeholder="Any allergies or dietary requirements?"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm uppercase tracking-widest text-muted-foreground mb-2 font-sans"
            >
              Message for the Couple
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none transition-colors font-sans text-foreground resize-none"
              placeholder="Share your well wishes..."
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-12 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300"
            >
              Send RSVP
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVPSection;