import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Building2, FileText, Stamp, Newspaper, Phone, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import gisLogo from "@/assets/gis-logo.png";

const navItems = [
  { labelKey: "nav.home", href: "/", icon: Home },
  { labelKey: "nav.about", href: "/about", icon: Building2 },
  { labelKey: "nav.services", href: "/services", icon: FileText },
  { labelKey: "nav.permits", href: "/permits", icon: Stamp },
  { labelKey: "nav.news", href: "/news", icon: Newspaper },
  { labelKey: "nav.contact", href: "/contact", icon: Phone },
  { labelKey: "nav.resources", href: "/resources", icon: HelpCircle },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

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

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 rounded-2xl py-2 px-4 backdrop-blur-xl border border-border/30 ${
          isScrolled
            ? "bg-card/80 shadow-glass"
            : "bg-card/60 shadow-lg"
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between">
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
            {navItems.map((item) => (
              <Link
                key={item.labelKey}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {t(item.labelKey)}
              </Link>
            ))}
          </div>

          {/* Search & CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <LanguageSwitcher isScrolled={true} />
            <DarkModeToggle isScrolled={true} />
            <Button
              variant="hero"
              size="sm"
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
          className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-card/95 backdrop-blur-xl border-l border-border/30 shadow-xl transition-transform duration-300 ${
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
              {navItems.map((item, index) => (
                <Link
                  key={item.labelKey}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 animate-fade-up active:scale-[0.98] ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground hover:bg-muted"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary" : "text-primary/60"}`} />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </Link>
              ))}
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