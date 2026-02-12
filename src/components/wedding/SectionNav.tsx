import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

const sections = [
  { id: "hero", labelKey: "hero.rsvp" },
  { id: "story", labelKey: "story.title" },
  { id: "timeline", labelKey: "timeline.title" },
  { id: "gallery", labelKey: "gallery.title" },
  { id: "countdown", labelKey: "countdown.title" },
  { id: "details", labelKey: "details.title" },
  { id: "travel", labelKey: "travel.title" },
  { id: "rsvp", labelKey: "rsvp.title" },
];

const SectionNav = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
    >
      {sections.map(({ id, labelKey }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={id === "hero" ? "Top" : t(labelKey)}
          className="group flex items-center justify-end gap-2"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="hidden group-hover:block text-xs font-sans text-foreground bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm whitespace-nowrap">
            {id === "hero" ? "Top" : t(labelKey)}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              activeSection === id
                ? "w-3 h-3 bg-primary shadow-md"
                : "w-2 h-2 bg-primary/40 hover:bg-primary/70"
            }`}
          />
        </a>
      ))}
    </nav>
  );
};

export default SectionNav;
