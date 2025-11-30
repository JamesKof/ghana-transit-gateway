import { Globe } from "lucide-react";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

const languages: Language[] = ["en", "fr", "tw", "ga", "ee"];

export function LanguageSwitcher({ isScrolled = true }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors ${
            isScrolled
              ? "hover:bg-muted text-muted-foreground hover:text-foreground"
              : "hover:bg-secondary/10 text-secondary/70 hover:text-secondary"
          }`}
          aria-label="Select language"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-medium uppercase">{language}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-card border-border z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`cursor-pointer ${
              language === lang ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <span className="font-medium">{languageNames[lang]}</span>
            <span className="ml-auto text-xs text-muted-foreground uppercase">
              {lang}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
