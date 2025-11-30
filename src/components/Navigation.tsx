import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Building2, FileText, Stamp, Newspaper, Phone, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import gisLogo from "@/assets/gis-logo.png";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About GIS", href: "/about", icon: Building2 },
  { label: "Services", href: "/services", icon: FileText },
  { label: "Permits & Visas", href: "/permits", icon: Stamp },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "Resources", href: "/resources", icon: HelpCircle },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 ${
          isScrolled
            ? "glass-nav rounded-2xl py-2 px-4"
            : "bg-transparent py-3 px-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={gisLogo}
              alt="Ghana Immigration Service Logo"
              className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <p className={`font-serif font-bold text-lg leading-tight ${isScrolled ? "text-primary" : "text-secondary"}`}>
                Ghana Immigration
              </p>
              <p className={`text-xs font-medium ${isScrolled ? "text-muted-foreground" : "text-secondary/80"}`}>
                Service
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? isScrolled
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/20 text-secondary"
                    : isScrolled
                    ? "text-foreground hover:text-primary hover:bg-primary/10"
                    : "text-secondary/90 hover:text-secondary hover:bg-secondary/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search & CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-xl transition-colors ${
                isScrolled 
                  ? "hover:bg-muted text-muted-foreground hover:text-foreground" 
                  : "hover:bg-secondary/10 text-secondary/70 hover:text-secondary"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Button
              variant={isScrolled ? "hero" : "heroOutline"}
              size="sm"
              asChild
            >
              <Link to="/services">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-xl transition-colors ${
                isScrolled ? "hover:bg-muted" : "hover:bg-secondary/10"
              }`}
              aria-label="Search"
            >
              <Search className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-secondary"}`} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isScrolled ? "hover:bg-muted" : "hover:bg-secondary/10"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-secondary"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-secondary"}`} />
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
          className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-card shadow-xl transition-transform duration-300 ${
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
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors animate-fade-up ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary" : "text-secondary"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
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
