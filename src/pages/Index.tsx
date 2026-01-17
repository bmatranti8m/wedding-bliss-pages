import HeroSection from "@/components/wedding/HeroSection";
import OurStorySection from "@/components/wedding/OurStorySection";
import TimelineSection from "@/components/wedding/TimelineSection";
import EventDetailsSection from "@/components/wedding/EventDetailsSection";
import CountdownSection from "@/components/wedding/CountdownSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import FooterSection from "@/components/wedding/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
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