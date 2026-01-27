import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, CalendarDays, Map, ArrowRight } from "lucide-react";
import venueImage from "@/assets/venue.jpg";

const EventDetailsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const events = [
    {
      title: "The Ceremony",
      time: "5:00 PM",
      description: "Join us as we exchange our vows in an intimate outdoor ceremony surrounded by olive groves.",
      icon: CalendarDays,
    },
    {
      title: "Cocktail Hour",
      time: "5:30 PM",
      description: "Enjoy craft cocktails and hors d'oeuvres while overlooking the stunning Tuscan hills.",
      icon: Clock,
    },
    {
      title: "Reception & Dinner",
      time: "8:00 PM",
      description: "An evening of fine dining, heartfelt toasts, and dancing under the stars.",
      icon: MapPin,
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="decorative-flourish mb-4">✦</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Wedding Details
          </h2>
          <div className="decorative-line" />
        </motion.div>

        {/* Venue Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden aspect-[21/9]">
            <img
              src={venueImage}
              alt="Vineyard Estate Venue"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <h3 className="font-serif text-3xl md:text-4xl font-light mb-2">
                Grand Hotel Villa Parisi
              </h3>
              <div className="flex flex-col gap-3">
                <motion.a
                  href="https://www.google.com/maps/search/?api=1&query=Grand+Hotel+Villa+Parisi,+Via+Romolo+Monti+10,+Castiglioncello,+Italy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-2 bg-white hover:bg-gray-100 rounded-full transition-colors duration-300 group shadow-lg self-start"
                  aria-label="Open in Google Maps"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-sans uppercase tracking-wide">Get me there</span>
                    <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="w-px h-5 bg-gray-300" />
                  <Map className="w-5 h-5 text-primary" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className="text-center p-8 bg-card border border-border hover:border-primary transition-colors duration-300"
            >
              <event.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">
                {event.title}
              </h3>
              <p className="text-primary font-serif text-xl mb-4">{event.time}</p>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                {event.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsSection;