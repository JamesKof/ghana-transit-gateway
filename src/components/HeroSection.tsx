import { ArrowRight, Shield, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.1" className="text-secondary" />
          <line x1="20" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" className="text-secondary" />
          <line x1="40" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="0.1" className="text-secondary" />
        </svg>
      </div>

      <div className="container relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-8">
            <Shield className="w-4 h-4 text-secondary" />
            <span className="text-secondary text-sm font-medium">Official Government Service</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-secondary leading-tight mb-6">
            Welcome to{" "}
            <span className="text-gradient-gold">Ghana Immigration Service</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-secondary/80 max-w-3xl mx-auto mb-4 font-light">
            Regulating Migration, Facilitating Mobility
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-secondary/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            The Ghana Immigration Service is the lead agency responsible for migration management in Ghana, 
            ensuring national security while facilitating legitimate travel and promoting economic development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => scrollToSection("#services")}
              className="group"
            >
              Explore Services
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              onClick={() => scrollToSection("#about")}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Globe, value: "16+", label: "Border Posts" },
              { icon: Users, value: "30M+", label: "Population Served" },
              { icon: Shield, value: "Since 1963", label: "Serving Ghana" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-8 h-8 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-secondary/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
