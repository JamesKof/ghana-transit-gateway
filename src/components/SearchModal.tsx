import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Stamp, HelpCircle, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: React.ElementType;
}

const searchData: SearchResult[] = [
  // Services
  { title: "Tourist Visa", description: "Single or multiple entry visas for visitors", href: "/services", category: "Services", icon: FileText },
  { title: "Work Permit", description: "Authorization for employment in Ghana", href: "/permits", category: "Permits", icon: Stamp },
  { title: "Residence Permit", description: "Long-term stay authorization", href: "/permits", category: "Permits", icon: Stamp },
  { title: "Visa on Arrival", description: "Entry for AU member states", href: "/services", category: "Services", icon: FileText },
  { title: "Transit Visa", description: "Short-term visa for travelers passing through", href: "/services", category: "Services", icon: FileText },
  { title: "Student Permit", description: "Study authorization for foreign students", href: "/permits", category: "Permits", icon: Stamp },
  { title: "Dependent Permit", description: "Permits for family members", href: "/permits", category: "Permits", icon: Stamp },
  { title: "Re-entry Visa", description: "Authorization to re-enter Ghana", href: "/services", category: "Services", icon: FileText },
  { title: "Permit Extension", description: "Renewal services for existing permits", href: "/services", category: "Services", icon: FileText },
  // FAQs
  { title: "How long does visa processing take?", description: "5-10 working days for standard processing", href: "/resources", category: "FAQ", icon: HelpCircle },
  { title: "Work permit requirements", description: "Documents needed for work permit", href: "/resources", category: "FAQ", icon: HelpCircle },
  { title: "Visa extension process", description: "How to extend your visa in Ghana", href: "/resources", category: "FAQ", icon: HelpCircle },
  { title: "Application status check", description: "How to track your application", href: "/resources", category: "FAQ", icon: HelpCircle },
  // About
  { title: "About GIS", description: "Mission, vision, and core mandate", href: "/about", category: "About", icon: Building2 },
  { title: "Contact Us", description: "Get in touch with GIS offices", href: "/contact", category: "Contact", icon: Building2 },
  { title: "Regional Offices", description: "Find GIS offices near you", href: "/contact", category: "Contact", icon: Building2 },
  { title: "Fee Schedule", description: "Current fees for immigration services", href: "/resources", category: "Resources", icon: FileText },
  { title: "Legal Handbook", description: "Immigration laws and regulations", href: "/resources", category: "Resources", icon: FileText },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-up">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for services, permits, FAQs..."
            className="flex-grow bg-transparent text-foreground text-lg placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length > 1 && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords</p>
            </div>
          )}
          
          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((result, index) => (
                <Link
                  key={index}
                  to={result.href}
                  onClick={onClose}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                    <result.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {result.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {result.category}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {query.length <= 1 && (
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {["Tourist Visa", "Work Permit", "Application Status", "Fee Schedule", "Contact"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted">ESC</kbd> to close</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
