import { useState, useEffect } from "react";
import { FileText, Stamp, Calendar, Upload, Phone, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const quickActions = [
  {
    icon: FileText,
    labelKey: "Check Status",
    href: "/#status-checker",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    icon: Stamp,
    labelKey: "Apply for Visa",
    href: "/services",
    color: "bg-secondary/10 text-secondary hover:bg-secondary/20",
  },
  {
    icon: Calendar,
    labelKey: "Book Appointment",
    href: "/#manage-application",
    color: "bg-accent/10 text-accent hover:bg-accent/20",
  },
  {
    icon: Upload,
    labelKey: "Upload Documents",
    href: "/#manage-application",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    icon: Phone,
    labelKey: "Contact Us",
    href: "/contact",
    color: "bg-secondary/10 text-secondary hover:bg-secondary/20",
  },
];

export function FloatingQuickActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleActionClick = () => {
    setIsExpanded(false);
  };

  return (
    <div
      className={`fixed bottom-24 right-8 z-40 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-16 pointer-events-none"
      }`}
    >
      {/* Quick Actions Menu */}
      <div
        className={`mb-4 space-y-2 transition-all duration-300 ${
          isExpanded
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link
              key={index}
              to={action.href}
              onClick={handleActionClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-border/50 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation ${action.color}`}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">{action.labelKey}</span>
            </Link>
          );
        })}
      </div>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 touch-manipulation ${
          isExpanded ? "rotate-45" : "rotate-0"
        }`}
        size="icon"
        aria-label="Quick actions menu"
      >
        {isExpanded ? <X className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
      </Button>
    </div>
  );
}
