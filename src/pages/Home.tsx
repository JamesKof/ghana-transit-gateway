import { HeroSlider } from "@/components/HeroSlider";
import { ApplicationStatusChecker } from "@/components/ApplicationStatusChecker";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { DocumentUpload } from "@/components/DocumentUpload";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, FileText, Globe, Phone, BookOpen, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerReveal } from "@/hooks/useScrollAnimation";

const quickNavItems = [
  {
    icon: Shield,
    titleKey: "nav.about",
    description: "Learn about our mission, vision, and core mandate",
    href: "/about",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    titleKey: "nav.services",
    description: "Explore visa and permit services we offer",
    href: "/services",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Globe,
    titleKey: "nav.permits",
    description: "View permit categories and requirements",
    href: "/permits",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Newspaper,
    titleKey: "nav.news",
    description: "Stay informed with latest announcements",
    href: "/news",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    titleKey: "nav.resources",
    description: "Access forms, guides, and FAQs",
    href: "/resources",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Phone,
    titleKey: "nav.contact",
    description: "Get in touch with our service points",
    href: "/contact",
    color: "bg-accent/10 text-accent",
  },
];

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <HeroSlider />
      
      {/* Quick Navigation Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Quick Navigation
              </h2>
              <p className="text-muted-foreground">
                Find what you're looking for quickly with our organized sections
              </p>
            </div>
          </ScrollReveal>
          
          <StaggerReveal
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            staggerDelay={100}
            animation="fade-up"
          >
            {quickNavItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className="group bg-card rounded-2xl p-10 border border-border shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col min-h-[280px] w-full"
                >
                  <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <IconComponent className="w-10 h-10 flex-shrink-0" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-2xl text-foreground mb-4 group-hover:text-primary transition-colors flex-shrink-0 leading-tight">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-base mb-6 flex-grow leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-auto">
                    Explore <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      {/* Application Status Checker */}
      <ScrollReveal animation="fade-up">
        <ApplicationStatusChecker />
      </ScrollReveal>

      {/* Document Upload & Appointment Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Manage Your Application
              </h2>
              <p className="text-muted-foreground">
                Upload documents or book an appointment at any GIS office
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollReveal animation="fade-right" delay={100}>
              <DocumentUpload />
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={200}>
              <AppointmentBooking />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
