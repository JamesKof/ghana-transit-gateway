import { HeroSlider } from "@/components/HeroSlider";
import { ApplicationStatusChecker } from "@/components/ApplicationStatusChecker";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { DocumentUpload } from "@/components/DocumentUpload";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PullToRefresh } from "@/components/PullToRefresh";
import { FloatingQuickActions } from "@/components/FloatingQuickActions";
import { QuickNavSkeleton, QuickNavSkeletonMobile } from "@/components/skeletons/QuickNavSkeleton";
import { ApplicationStatusSkeleton } from "@/components/skeletons/ApplicationStatusSkeleton";
import { ManagementSkeleton, ManagementSkeletonMobile } from "@/components/skeletons/ManagementSkeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, FileText, Globe, Phone, BookOpen, Newspaper, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerReveal } from "@/hooks/useScrollAnimation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useParallax } from "@/hooks/useParallax";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    quickNav: true,
    statusChecker: true,
    management: true,
  });

  // Parallax effects
  const heroParallax = useParallax({ speed: 0.3, direction: "up" });
  const sectionParallax = useParallax({ speed: 0.15, direction: "up" });

  // Pull to refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Content refreshed!");
  };

  const { isPulling, pullDistance, isRefreshing, threshold } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      <ScrollProgress />
      <FloatingQuickActions />
      {isMobile && (
        <PullToRefresh 
          pullDistance={pullDistance} 
          isRefreshing={isRefreshing} 
          threshold={threshold}
        />
      )}
      
      <div
        style={{
          transform: `translateY(${heroParallax}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <HeroSlider />
      </div>
      
      <BackToTop />
      
      {/* Quick Navigation Section */}
      <section 
        className="section-padding bg-background scroll-mt-20 transition-all duration-500 ease-in-out relative overflow-hidden" 
        id="quick-navigation"
      >
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            transform: `translateY(${sectionParallax * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          {isLoading ? (
            isMobile ? <QuickNavSkeletonMobile /> : <QuickNavSkeleton />
          ) : isMobile ? (
            <Collapsible open={openSections.quickNav} onOpenChange={() => toggleSection('quickNav')}>
              <div className="mb-8">
                <CollapsibleTrigger className="w-full group">
                  <div className="flex items-center justify-between bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-all duration-300 min-h-[72px] touch-manipulation active:scale-98">
                    <div className="text-left">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                        Quick Navigation
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Find what you're looking for quickly
                      </p>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openSections.quickNav ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-6 animate-accordion-down">
                  <div className="grid grid-cols-1 gap-6">
                    {quickNavItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={index}
                          to={item.href}
                          className="group bg-card rounded-2xl p-8 border border-border shadow-md active:shadow-lg active:scale-98 transition-all duration-300 flex flex-col min-h-[240px] w-full touch-manipulation"
                        >
                          <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-active:scale-110 transition-transform flex-shrink-0`}>
                            <IconComponent className="w-8 h-8 flex-shrink-0" strokeWidth={2} />
                          </div>
                          <h3 className="font-semibold text-xl text-foreground mb-3 group-active:text-primary transition-colors flex-shrink-0 leading-tight">
                            {t(item.titleKey)}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 flex-grow leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex items-center text-primary text-sm font-semibold flex-shrink-0 mt-auto">
                            Explore <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" strokeWidth={2.5} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ) : (
            <ScrollReveal animation="fade-up">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Quick Navigation
                </h2>
                <p className="text-muted-foreground">
                  Find what you're looking for quickly with our organized sections
                </p>
              </div>
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
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Application Status Checker */}
      <section 
        className="scroll-mt-20 transition-all duration-500 ease-in-out relative"
        id="status-checker"
        style={{
          transform: `translateY(${sectionParallax * 0.3}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {isLoading ? (
          <ApplicationStatusSkeleton />
        ) : isMobile ? (
          <Collapsible open={openSections.statusChecker} onOpenChange={() => toggleSection('statusChecker')}>
            <div className="section-padding bg-background">
              <div className="container">
                <CollapsibleTrigger className="w-full group mb-6">
                  <div className="flex items-center justify-between bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-all duration-300 min-h-[72px] touch-manipulation active:scale-98">
                    <div className="text-left">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                        Check Application Status
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Track your application progress
                      </p>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openSections.statusChecker ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-accordion-down">
                  <ApplicationStatusChecker />
                </CollapsibleContent>
              </div>
            </div>
          </Collapsible>
        ) : (
          <ScrollReveal animation="fade-up">
            <ApplicationStatusChecker />
          </ScrollReveal>
        )}
      </section>

      {/* Document Upload & Appointment Section */}
      <section 
        className="section-padding bg-muted/30 scroll-mt-20 transition-all duration-500 ease-in-out relative overflow-hidden" 
        id="manage-application"
      >
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            transform: `translateY(${sectionParallax * 0.4}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          {isLoading ? (
            isMobile ? <ManagementSkeletonMobile /> : <ManagementSkeleton />
          ) : isMobile ? (
            <Collapsible open={openSections.management} onOpenChange={() => toggleSection('management')}>
              <div className="mb-8">
                <CollapsibleTrigger className="w-full group">
                  <div className="flex items-center justify-between bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-all duration-300 min-h-[72px] touch-manipulation active:scale-98">
                    <div className="text-left">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                        Manage Your Application
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Upload documents or book appointments
                      </p>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openSections.management ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-6 animate-accordion-down">
                  <div className="space-y-6">
                    <DocumentUpload />
                    <AppointmentBooking />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
