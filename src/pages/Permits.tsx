import { PermitsSection } from "@/components/PermitsSection";
import { PrintableChecklist } from "@/components/PrintableChecklist";
import { FeeCalculator } from "@/components/FeeCalculator";

const Permits = () => {
  return (
    <div className="pt-24">
      <PermitsSection />
      
      {/* Application Tools Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              Application Tools
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Prepare Your Application
            </h2>
            <p className="text-muted-foreground">
              Download checklists and calculate fees before submitting your permit application
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PrintableChecklist />
            <FeeCalculator />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Permits;
