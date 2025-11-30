import { HeroSlider } from "@/components/HeroSlider";
import { ApplicationStatusChecker } from "@/components/ApplicationStatusChecker";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { DocumentUpload } from "@/components/DocumentUpload";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, FileText, Globe, Phone, BookOpen, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Quick Navigation
            </h2>
            <p className="text-muted-foreground">
              Find what you're looking for quickly with our organized sections
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {t(item.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Application Status Checker */}
      <ApplicationStatusChecker />

      {/* Document Upload & Appointment Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Manage Your Application
            </h2>
            <p className="text-muted-foreground">
              Upload documents or book an appointment at any GIS office
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <DocumentUpload />
            <AppointmentBooking />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
