import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2, FileText, Stamp, Newspaper, Phone, HelpCircle, Search, ChevronDown, Shield, Calendar, Crown, Briefcase, MapPin, Camera, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import gisLogo from "@/assets/gis-logo.png";

const aboutSubItems = [
  { label: "Overview", href: "/about?tab=overview", icon: Shield },
  { label: "History", href: "/about?tab=history", icon: Calendar },
  { label: "Structure", href: "/about?tab=structure", icon: Building2 },
  { label: "Leadership", href: "/about?tab=leadership", icon: Crown },
  { label: "Directorates", href: "/about?tab=directorates", icon: Briefcase },
  { label: "Regional Commands", href: "/about?tab=regional", icon: MapPin },
  { label: "Leadership Profiles", href: "/leadership", icon: Crown },
];

const servicesSubItems = [
  { label: "All Services", href: "/services", icon: FileText },
  { label: "Permits & Passes", href: "/permits", icon: Stamp },
];

const mediaSubItems = [
  { label: "News & Updates", href: "/news", icon: Newspaper },
  { label: "Photo Gallery", href: "/gallery", icon: Camera },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [mobileMediaExpanded, setMobileMediaExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useLanguage();

  // Navbar entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutDropdownOpen(false);
        setServicesDropdownOpen(false);
        setMediaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/about") {
      return location.pathname === "/about";
    }
    return location.pathname === href;
  };

  const isAboutActive =
    location.pathname === "/about" || location.pathname === "/leadership";
  const isServicesActive =
    location.pathname === "/services" || location.pathname === "/permits";
  const isEVisaActive = location.pathname === "/e-visa";
  const isMediaActive =
    location.pathname === "/news" || location.pathname === "/gallery";
  const isResourcesActive = location.pathname === "/resources";
  const isContactActive = location.pathname === "/contact";

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-2xl py-2 px-4 backdrop-blur-xl border border-border/30 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-card/80 shadow-glass"
            : "bg-card/60 shadow-lg"
        } ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between" ref={dropdownRef}>
          {/* Logo - Only Icon */}
          <Link to="/" className="flex items-center group">
            <img
              src={gisLogo}
              alt="Ghana Immigration Service Logo"
              className="h-10 w-10 object-contain transition-all duration-300 group-hover:scale-110 group-active:scale-95"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                setAboutDropdownOpen(true);
                setServicesDropdownOpen(false);
                setMediaDropdownOpen(false);
              }}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isAboutActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_hsl(155_100%_21%/0.15)]"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{
                  transitionDelay: isVisible ? "150ms" : "0ms",
                }}
              >
                <Building2 className="w-4 h-4" />
                {t("nav.about")}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    aboutDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
                  aboutDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="py-2">
                  {aboutSubItems.map((subItem, subIndex) => (
                    <Link
                      key={subItem.label}
                      to={subItem.href}
                      onClick={() => setAboutDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      style={{
                        animationDelay: `${subIndex * 50}ms`,
                      }}
                    >
                      <subItem.icon className="w-4 h-4 text-primary/60" />
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                setServicesDropdownOpen(true);
                setAboutDropdownOpen(false);
                setMediaDropdownOpen(false);
              }}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isServicesActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_hsl(155_100%_21%/0.15)]"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{
                  transitionDelay: isVisible ? "200ms" : "0ms",
                }}
              >
                <FileText className="w-4 h-4" />
                {t("nav.services")}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    servicesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
                  servicesDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="py-2">
                  {servicesSubItems.map((subItem, subIndex) => (
                    <Link
                      key={subItem.label}
                      to={subItem.href}
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      style={{
                        animationDelay: `${subIndex * 50}ms`,
                      }}
                    >
                      <subItem.icon className="w-4 h-4 text-primary/60" />
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* E-Visa direct link */}
            <Link
              to="/e-visa"
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isEVisaActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_hsl(155_100%_21%/0.15)]"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{
                transitionDelay: isVisible ? "250ms" : "0ms",
              }}
            >
              <Globe2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              {t("E-Visa")}
            </Link>

            {/* Media dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                setMediaDropdownOpen(true);
                setAboutDropdownOpen(false);
                setServicesDropdownOpen(false);
              }}
              onMouseLeave={() => setMediaDropdownOpen(false)}
            >
              <button
                type="button"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isMediaActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_hsl(155_100%_21%/0.15)]"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{
                  transitionDelay: isVisible ? "300ms" : "0ms",
                }}
              >
                <Newspaper className="w-4 h-4" />
                {t("Media")}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    mediaDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
                  mediaDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="py-2">
                  {mediaSubItems.map((subItem, subIndex) => (
                    <Link
                      key={subItem.label}
                      to={subItem.href}
                      onClick={() => setMediaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      style={{
                        animationDelay: `${subIndex * 50}ms`,
                      }}
                    >
                      <subItem.icon className="w-4 h-4 text-primary/60" />
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources link */}
            <Link
              to="/resources"
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isResourcesActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_hsl(155_100%_21%/0.15)]"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{
                transitionDelay: isVisible ? "350ms" : "0ms",
              }}
            >
              <HelpCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              {t("nav.resources")}
            </Link>

            {/* Contact link */}
            <Link
              to="/contact"
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isContactActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_hsl(155_100%_21%/0.15)]"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{
                transitionDelay: isVisible ? "400ms" : "0ms",
              }}
            >
              <Phone className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              {t("nav.contact")}
            </Link>
          </div>

          {/* Search & CTA */}
          <div className={`hidden md:flex items-center gap-2 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ transitionDelay: isVisible ? '500ms' : '0ms' }}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground hover:shadow-[0_0_12px_hsl(155_100%_21%/0.12)] active:scale-95"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <LanguageSwitcher isScrolled={true} />
            <DarkModeToggle isScrolled={true} />
            <Button
              variant="hero"
              size="sm"
              className="hover:shadow-[0_0_20px_hsl(45_93%_58%/0.4)]"
              asChild
            >
              <Link to="/services">{t("nav.getStarted")}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl transition-all duration-200 hover:bg-muted active:scale-95"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl transition-all duration-200 hover:bg-muted active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-card/95 backdrop-blur-xl border-l border-border/30 shadow-xl transition-transform duration-300 overflow-y-auto ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <img src={gisLogo} alt="GIS Logo" className="h-10 w-10 object-contain" />
                <span className="font-serif font-bold text-primary">GIS</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {/* About group */}
              <div>
                <button
                  onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isAboutActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2
                      className={`w-5 h-5 ${
                        isAboutActive ? "text-primary" : "text-primary/60"
                      }`}
                    />
                    <span className="font-medium">{t("nav.about")}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileAboutExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileAboutExpanded ? "max-h-96 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="pl-4 space-y-1">
                    {aboutSubItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <subItem.icon className="w-4 h-4 text-primary/50" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services group */}
              <div>
                <button
                  onClick={() =>
                    setMobileServicesExpanded(!mobileServicesExpanded)
                  }
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isServicesActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText
                      className={`w-5 h-5 ${
                        isServicesActive ? "text-primary" : "text-primary/60"
                      }`}
                    />
                    <span className="font-medium">{t("nav.services")}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileServicesExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileServicesExpanded ? "max-h-96 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="pl-4 space-y-1">
                    {servicesSubItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <subItem.icon className="w-4 h-4 text-primary/50" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* E-Visa link */}
              <Link
                to="/e-visa"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 animate-fade-up active:scale-[0.98] ${
                  isEVisaActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Globe2
                  className={`w-5 h-5 ${
                    isEVisaActive ? "text-primary" : "text-primary/60"
                  }`}
                />
                <span className="font-medium">{t("E-Visa")}</span>
              </Link>

              {/* Media group */}
              <div>
                <button
                  onClick={() => setMobileMediaExpanded(!mobileMediaExpanded)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isMediaActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Newspaper
                      className={`w-5 h-5 ${
                        isMediaActive ? "text-primary" : "text-primary/60"
                      }`}
                    />
                    <span className="font-medium">{t("Media")}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileMediaExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileMediaExpanded ? "max-h-96 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="pl-4 space-y-1">
                    {mediaSubItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <subItem.icon className="w-4 h-4 text-primary/50" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resources link */}
              <Link
                to="/resources"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 animate-fade-up active:scale-[0.98] ${
                  isResourcesActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <HelpCircle
                  className={`w-5 h-5 ${
                    isResourcesActive ? "text-primary" : "text-primary/60"
                  }`}
                />
                <span className="font-medium">{t("nav.resources")}</span>
              </Link>

              {/* Contact link */}
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 animate-fade-up active:scale-[0.98] ${
                  isContactActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Phone
                  className={`w-5 h-5 ${
                    isContactActive ? "text-primary" : "text-primary/60"
                  }`}
                />
                <span className="font-medium">{t("nav.contact")}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
              <LanguageSwitcher isScrolled={true} />
              <DarkModeToggle isScrolled={true} />
            </div>

            <div className="mt-4">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.getStarted")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
