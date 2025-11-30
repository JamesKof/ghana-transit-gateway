import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PermitsSection } from "@/components/PermitsSection";
import { NewsSection } from "@/components/NewsSection";
import { ResourcesSection } from "@/components/ResourcesSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PermitsSection />
        <NewsSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
