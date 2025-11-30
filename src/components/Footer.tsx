import { Facebook, Twitter, Instagram, Youtube, ExternalLink } from "lucide-react";
import gisLogo from "@/assets/gis-logo.png";

const quickLinks = [
  { label: "About GIS", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Permits & Visas", href: "#permits" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

const services = [
  { label: "Tourist Visa", href: "#services" },
  { label: "Work Permit", href: "#services" },
  { label: "Residence Permit", href: "#services" },
  { label: "Visa on Arrival", href: "#services" },
  { label: "Passport Services", href: "#services" },
];

const resources = [
  { label: "FAQs", href: "#faq" },
  { label: "Legal Handbook", href: "#faq" },
  { label: "Application Forms", href: "#faq" },
  { label: "Fee Schedule", href: "#faq" },
  { label: "Regional Offices", href: "#contact" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={gisLogo} alt="GIS Logo" className="h-14 w-14 object-contain" />
              <div>
                <p className="font-serif font-bold text-xl text-secondary">Ghana Immigration</p>
                <p className="text-sm text-primary-foreground/70">Service</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-sm leading-relaxed">
              The Ghana Immigration Service is committed to regulating migration for national 
              security and development while providing quality services to all stakeholders.
            </p>
            <p className="text-sm text-secondary font-medium mb-4">
              "Friendship with Vigilance"
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-secondary">Services</h4>
            <ul className="space-y-3">
              {services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-5 text-secondary">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Government Links Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4">
          <div className="flex flex-wrap gap-4 justify-center text-xs text-primary-foreground/60">
            <a href="https://presidency.gov.gh" target="_blank" rel="noopener noreferrer" className="hover:text-secondary flex items-center gap-1">
              Office of the President <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://moi.gov.gh" target="_blank" rel="noopener noreferrer" className="hover:text-secondary flex items-center gap-1">
              Ministry of Interior <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://mint.gov.gh" target="_blank" rel="noopener noreferrer" className="hover:text-secondary flex items-center gap-1">
              Ministry of National Security <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-primary-foreground/10 bg-primary/50">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Ghana Immigration Service. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-secondary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
