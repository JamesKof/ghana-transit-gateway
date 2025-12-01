import { ResourcesSection } from "@/components/ResourcesSection";
import { ScrollReveal } from "@/hooks/useScrollAnimation";

const Resources = () => {
  return (
    <div className="pt-24">
      <ScrollReveal animation="fade-up">
        <ResourcesSection />
      </ScrollReveal>
    </div>
  );
};

export default Resources;
