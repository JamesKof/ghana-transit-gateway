import { ServicesSection } from "@/components/ServicesSection";
import { FeeCalculator } from "@/components/FeeCalculator";
import { VisaEligibilityQuiz } from "@/components/VisaEligibilityQuiz";
import { EmailNotificationSignup } from "@/components/EmailNotificationSignup";

const Services = () => {
  return (
    <div className="pt-24">
      <ServicesSection />
      
      {/* Tools Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Service Tools
            </h2>
            <p className="text-muted-foreground">
              Use our tools to find the right visa and estimate costs for your application
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <VisaEligibilityQuiz />
            <FeeCalculator />
          </div>
        </div>
      </section>

      {/* Email Notifications Section */}
      <section className="section-padding bg-background">
        <div className="container max-w-xl">
          <EmailNotificationSignup />
        </div>
      </section>
    </div>
  );
};

export default Services;
