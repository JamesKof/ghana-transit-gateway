import { useState, useEffect } from "react";
import { ArrowRight, Shield, Globe, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroOfficers from "@/assets/hero-officers.jpg";
import heroHeadquarters from "@/assets/hero-headquarters.jpg";
import heroBorder from "@/assets/hero-border.jpg";

const slides = [
  {
    image: heroOfficers,
    title: "Ghana Immigration Officers",
    subtitle: "Professional Service & National Security",
  },
  {
    image: heroHeadquarters,
    title: "GIS Headquarters",
    subtitle: "Serving Ghana Since 1963",
  },
  {
    image: heroBorder,
    title: "Border Management",
    subtitle: "Secure & Efficient Border Control",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        </div>
      ))}

      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.1" className="text-secondary" />
          <line x1="20" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" className="text-secondary" />
          <line x1="40" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="0.1" className="text-secondary" />
        </svg>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-secondary/20 hover:bg-secondary/40 flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-secondary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-secondary/20 hover:bg-secondary/40 flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-secondary" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-secondary w-8"
                : "bg-secondary/40 hover:bg-secondary/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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
            {t("hero.welcome")}{" "}
            <span className="text-gradient-gold">{t("hero.title")}</span>
          </h1>

          {/* Dynamic Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-secondary/80 max-w-3xl mx-auto mb-4 font-light">
            {t("hero.subtitle")}
          </p>

          {/* Slide Caption */}
          <p className="text-base sm:text-lg text-secondary/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            {slides[currentSlide].subtitle} — The Ghana Immigration Service is the lead agency 
            responsible for migration management in Ghana.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              variant="hero" 
              size="xl" 
              asChild
              className="group"
            >
              <Link to="/services">
                {t("hero.applyOnline")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              asChild
            >
              <Link to="/about">{t("hero.trackApplication")}</Link>
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
