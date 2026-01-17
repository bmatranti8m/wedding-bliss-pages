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
    phone: "",
    attending: "",
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
      phone: "",
      attending: "",
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
            Please respond by May 16, 2026
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
              Full Name
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
              Email Address
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
              Phone Number
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
              Will you be attending?
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={formData.attending === "yes"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary mr-4"
                />
                <span className="text-primary font-sans text-base">Yes, I'll be there</span>
              </label>
              <label className="flex items-center p-4 bg-white border border-gray-300 cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={formData.attending === "no"}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary mr-4"
                />
                <span className="text-primary font-sans text-base">Sorry, I can't make it</span>
              </label>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300"
            >
              Submit RSVP
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVPSection;