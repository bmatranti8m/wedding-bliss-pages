import { useState, useEffect } from "react";
import HeroSection from "@/components/wedding/HeroSection";
import OurStorySection from "@/components/wedding/OurStorySection";
import TimelineSection from "@/components/wedding/TimelineSection";
import EventDetailsSection from "@/components/wedding/EventDetailsSection";
import CountdownSection from "@/components/wedding/CountdownSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import FooterSection from "@/components/wedding/FooterSection";
import EnvelopeOverlay from "@/components/wedding/EnvelopeOverlay";
import SectionNav from "@/components/wedding/SectionNav";

const Index = () => {
  const [overlayKey, setOverlayKey] = useState(0);

  useEffect(() => {
    // Generate a unique key on mount to force remount on page reload
    setOverlayKey(Date.now());
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <EnvelopeOverlay key={overlayKey} />
      <SectionNav />
      <HeroSection />
      <OurStorySection />
      <TimelineSection />
      <CountdownSection />
      <EventDetailsSection />
      <RSVPSection />
      <FooterSection />
    </main>
  );
};

export default Index;