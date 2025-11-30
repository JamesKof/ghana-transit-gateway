import { 
  Plane, 
  FileCheck, 
  Building, 
  Clock, 
  RefreshCw, 
  Users, 
  Briefcase, 
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Plane,
    title: "Tourist Visa",
    description: "Single or multiple entry visas for visitors wishing to tour Ghana for leisure, business meetings, or family visits.",
    category: "Visa",
  },
  {
    icon: Briefcase,
    title: "Work Permit",
    description: "Authorization for foreign nationals to engage in gainful employment within Ghana. Valid for up to 2 years.",
    category: "Permit",
  },
  {
    icon: Building,
    title: "Residence Permit",
    description: "Long-term stay authorization for foreign nationals wishing to reside in Ghana for extended periods.",
    category: "Permit",
  },
  {
    icon: Clock,
    title: "Visa on Arrival",
    description: "Facilitated entry for nationals of African Union member states and approved countries at designated ports.",
    category: "Visa",
  },
  {
    icon: RefreshCw,
    title: "Permit Extension",
    description: "Renewal services for existing residence and work permits before expiration date.",
    category: "Extension",
  },
  {
    icon: Plane,
    title: "Transit Visa",
    description: "Short-term visa for travelers passing through Ghana to a third destination.",
    category: "Visa",
  },
  {
    icon: FileCheck,
    title: "Re-entry Visa",
    description: "Authorization for permit holders to re-enter Ghana after temporary travel abroad.",
    category: "Visa",
  },
  {
    icon: GraduationCap,
    title: "Student Permit",
    description: "Study authorization for foreign nationals enrolled in Ghanaian educational institutions.",
    category: "Permit",
  },
  {
    icon: Users,
    title: "Dependent Permit",
    description: "Permits for family members accompanying work or residence permit holders in Ghana.",
    category: "Permit",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-muted/30 relative">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Immigration Services
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Ghana Immigration Service offers a comprehensive range of visa and permit services 
            to facilitate legal travel and stay in Ghana.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-secondary" />
                </div>
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {service.category}
                </span>
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex items-center text-secondary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Need help with your application? Our team is here to assist you.
          </p>
          <Button variant="gold" size="lg">
            View All Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
