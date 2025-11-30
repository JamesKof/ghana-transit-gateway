import { ServicesSection } from "@/components/ServicesSection";
import { FeeCalculator } from "@/components/FeeCalculator";
import { VisaEligibilityQuiz } from "@/components/VisaEligibilityQuiz";
import { EmailNotificationSignup } from "@/components/EmailNotificationSignup";
import { PrintableChecklist } from "@/components/PrintableChecklist";

const Services = () => {
  return (
    <div className="pt-24">
      <ServicesSection />
      
      {/* Tools Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Service Tools
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Plan Your Application
            </h2>
            <p className="text-muted-foreground">
              Use our tools to find the right visa, estimate costs, and prepare your documents
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <VisaEligibilityQuiz />
            <FeeCalculator />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <PrintableChecklist />
            <EmailNotificationSignup />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
