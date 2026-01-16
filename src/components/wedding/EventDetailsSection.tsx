import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import venueImage from "@/assets/venue.jpg";

const EventDetailsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const events = [
    {
      title: "The Ceremony",
      time: "4:00 PM",
      location: "Garden Chapel",
      description: "Join us as we exchange our vows in an intimate outdoor ceremony surrounded by olive groves.",
      icon: CalendarDays,
    },
    {
      title: "Cocktail Hour",
      time: "5:30 PM",
      location: "Terrace Gardens",
      description: "Enjoy craft cocktails and hors d'oeuvres while overlooking the stunning Tuscan hills.",
      icon: Clock,
    },
    {
      title: "Reception & Dinner",
      time: "7:00 PM",
      location: "Grand Ballroom",
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
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-foreground">
              <h3 className="font-serif text-3xl md:text-4xl font-light mb-2">
                Vineyard Estate
              </h3>
              <p className="font-sans font-light tracking-wide text-muted-foreground">
                Via del Chianti, 42 • Tuscany, Italy
              </p>
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
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                {event.location}
              </p>
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