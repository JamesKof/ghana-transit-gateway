import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "fr" | "tw" | "ga" | "ee";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About GIS",
    "nav.services": "Services",
    "nav.permits": "Permits & Visas",
    "nav.news": "News",
    "nav.contact": "Contact",
    "nav.resources": "Resources",
    "nav.getStarted": "Get Started",
    // Hero
    "hero.welcome": "Welcome to",
    "hero.title": "Ghana Immigration Service",
    "hero.subtitle": "Regulating Migration, Facilitating Mobility",
    "hero.description": "Your trusted partner for all immigration services in Ghana. Apply for visas, permits, and access comprehensive immigration support.",
    "hero.applyOnline": "Apply Online",
    "hero.trackApplication": "Track Application",
    // Services
    "services.title": "Our Services",
    "services.subtitle": "Comprehensive immigration services for individuals and organizations",
    // Common
    "common.search": "Search",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.download": "Download",
    "common.bookAppointment": "Book Appointment",
    "common.selectDate": "Select Date",
    "common.selectTime": "Select Time",
    "common.selectOffice": "Select Office",
    "common.fullName": "Full Name",
    "common.email": "Email Address",
    "common.phone": "Phone Number",
    "common.serviceType": "Service Type",
    // Footer
    "footer.quickLinks": "Quick Links",
    "footer.services": "Services",
    "footer.contact": "Contact Us",
    "footer.followUs": "Follow Us",
    "footer.copyright": "All rights reserved.",
    // Appointment
    "appointment.title": "Book an Appointment",
    "appointment.subtitle": "Schedule your visit to any GIS office",
    "appointment.success": "Appointment booked successfully!",
    "appointment.downloadConfirmation": "Download Confirmation",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.permits": "Permis & Visas",
    "nav.news": "Actualités",
    "nav.contact": "Contact",
    "nav.resources": "Ressources",
    "nav.getStarted": "Commencer",
    // Hero
    "hero.welcome": "Bienvenue à",
    "hero.title": "Service d'Immigration du Ghana",
    "hero.subtitle": "Réguler la Migration, Faciliter la Mobilité",
    "hero.description": "Votre partenaire de confiance pour tous les services d'immigration au Ghana. Demandez des visas, des permis et accédez à un soutien complet en matière d'immigration.",
    "hero.applyOnline": "Postuler en Ligne",
    "hero.trackApplication": "Suivre la Demande",
    // Services
    "services.title": "Nos Services",
    "services.subtitle": "Services d'immigration complets pour les particuliers et les organisations",
    // Common
    "common.search": "Rechercher",
    "common.submit": "Soumettre",
    "common.cancel": "Annuler",
    "common.download": "Télécharger",
    "common.bookAppointment": "Prendre Rendez-vous",
    "common.selectDate": "Sélectionner la Date",
    "common.selectTime": "Sélectionner l'Heure",
    "common.selectOffice": "Sélectionner le Bureau",
    "common.fullName": "Nom Complet",
    "common.email": "Adresse E-mail",
    "common.phone": "Numéro de Téléphone",
    "common.serviceType": "Type de Service",
    // Footer
    "footer.quickLinks": "Liens Rapides",
    "footer.services": "Services",
    "footer.contact": "Contactez-nous",
    "footer.followUs": "Suivez-nous",
    "footer.copyright": "Tous droits réservés.",
    // Appointment
    "appointment.title": "Prendre un Rendez-vous",
    "appointment.subtitle": "Planifiez votre visite dans un bureau GIS",
    "appointment.success": "Rendez-vous réservé avec succès!",
    "appointment.downloadConfirmation": "Télécharger la Confirmation",
  },
  tw: {
    // Twi (Akan)
    // Navigation
    "nav.home": "Fie",
    "nav.about": "Fa GIS Ho",
    "nav.services": "Nnwuma",
    "nav.permits": "Akwannya & Visa",
    "nav.news": "Nsɛm",
    "nav.contact": "Frɛ Yɛn",
    "nav.resources": "Nsɛm a Ɛboa",
    "nav.getStarted": "Hyɛ Ase",
    // Hero
    "hero.welcome": "Akwaaba",
    "hero.title": "Ghana Immigration Service",
    "hero.subtitle": "Yɛhwɛ Akwantu So, Yɛboa Akwantu",
    "hero.description": "Wo hokwan a wode wo ho to so wɔ Ghana immigration services nyinaa mu. Pɛ visa, permits, na nya mmoa.",
    "hero.applyOnline": "Pɛ Wɔ Intanɛt So",
    "hero.trackApplication": "Hwɛ Wo Application",
    // Services
    "services.title": "Yɛn Nnwuma",
    "services.subtitle": "Immigration services a ɛyɛ pɛ ma nnipa ne nkuo",
    // Common
    "common.search": "Hwehwɛ",
    "common.submit": "Mena",
    "common.cancel": "Gyae",
    "common.download": "Twe",
    "common.bookAppointment": "Hyɛ Da",
    "common.selectDate": "Yi Da",
    "common.selectTime": "Yi Bere",
    "common.selectOffice": "Yi Office",
    "common.fullName": "Din Nyinaa",
    "common.email": "Email",
    "common.phone": "Fon Nɔma",
    "common.serviceType": "Adwuma Mu",
    // Footer
    "footer.quickLinks": "Nkitahodi Ntɛm",
    "footer.services": "Nnwuma",
    "footer.contact": "Frɛ Yɛn",
    "footer.followUs": "Di Yɛn Akyi",
    "footer.copyright": "Hokwan nyinaa yɛ yɛn dea.",
    // Appointment
    "appointment.title": "Hyɛ Da",
    "appointment.subtitle": "Hyɛ da a wobɛba GIS office",
    "appointment.success": "Wo da no ahyɛ yiye!",
    "appointment.downloadConfirmation": "Twe Confirmation",
  },
  ga: {
    // Ga
    // Navigation
    "nav.home": "Weku",
    "nav.about": "GIS Shishi",
    "nav.services": "Dadeɛ",
    "nav.permits": "Akwannya kɛ Visa",
    "nav.news": "Gbɛji",
    "nav.contact": "Frɛ Wi",
    "nav.resources": "Shi Ni Bɔ",
    "nav.getStarted": "Dze Ase",
    // Hero
    "hero.welcome": "Ojekoo",
    "hero.title": "Ghana Immigration Service",
    "hero.subtitle": "Miihwɛ Migration So, Miibɔɔ Mobility",
    "hero.description": "Wo trustee ni immigration services nyinaa ni Ghana. Apply for visas, permits, kɛ access immigration support.",
    "hero.applyOnline": "Apply Online",
    "hero.trackApplication": "Track Application",
    // Services
    "services.title": "Mii Dadeɛ",
    "services.subtitle": "Immigration services ni individuals kɛ organizations",
    // Common
    "common.search": "Hwehwɛ",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.download": "Download",
    "common.bookAppointment": "Book Appointment",
    "common.selectDate": "Select Date",
    "common.selectTime": "Select Time",
    "common.selectOffice": "Select Office",
    "common.fullName": "Tooko Blɛ Nyinaa",
    "common.email": "Email",
    "common.phone": "Phone Number",
    "common.serviceType": "Service Type",
    // Footer
    "footer.quickLinks": "Quick Links",
    "footer.services": "Dadeɛ",
    "footer.contact": "Frɛ Wi",
    "footer.followUs": "Follow Wi",
    "footer.copyright": "Hokwan nyinaa yɛ wi dea.",
    // Appointment
    "appointment.title": "Book Appointment",
    "appointment.subtitle": "Schedule wo visit to GIS office",
    "appointment.success": "Appointment booked!",
    "appointment.downloadConfirmation": "Download Confirmation",
  },
  ee: {
    // Ewe
    // Navigation
    "nav.home": "Aƒeme",
    "nav.about": "GIS Ŋuti",
    "nav.services": "Dɔwɔwɔwo",
    "nav.permits": "Mɔɖeɖe kple Visa",
    "nav.news": "Nyawo",
    "nav.contact": "Ɖo Mía",
    "nav.resources": "Alesi",
    "nav.getStarted": "Dze Egɔme",
    // Hero
    "hero.welcome": "Woezɔ",
    "hero.title": "Ghana Immigration Service",
    "hero.subtitle": "Migration Ŋkume Kpɔkpɔ, Mobility Yeyeye",
    "hero.description": "Wò partner si wòateŋu aɖo ŋuse ɖe eŋu na immigration services katã le Ghana. Apply na visas, permits, eye nàkpɔ immigration support.",
    "hero.applyOnline": "Apply Le Internet Dzi",
    "hero.trackApplication": "Kpɔ Wò Application",
    // Services
    "services.title": "Míaƒe Dɔwɔwɔwo",
    "services.subtitle": "Immigration services si wo blibo na ameaɖewo kple habɔbɔwo",
    // Common
    "common.search": "Dí",
    "common.submit": "Ɖo Ɖa",
    "common.cancel": "Ɖe Asi Le Eŋu",
    "common.download": "Download",
    "common.bookAppointment": "Ŋlɔ Nkeke",
    "common.selectDate": "Tia Ŋkeke",
    "common.selectTime": "Tia Gaƒoƒo",
    "common.selectOffice": "Tia Office",
    "common.fullName": "Ŋkɔ Blibo",
    "common.email": "Email",
    "common.phone": "Fon Xexlẽdzesi",
    "common.serviceType": "Dɔwɔwɔ Ƒe Xexlẽme",
    // Footer
    "footer.quickLinks": "Kadodo Blewuwuwo",
    "footer.services": "Dɔwɔwɔwo",
    "footer.contact": "Ɖo Mía",
    "footer.followUs": "Dzi Mía Yome",
    "footer.copyright": "Mɔɖeɖe katã nye míatɔ.",
    // Appointment
    "appointment.title": "Ŋlɔ Nkeke",
    "appointment.subtitle": "Ŋlɔ ŋkeke si nàva GIS office",
    "appointment.success": "Woŋlɔ wò nkeke nyuie!",
    "appointment.downloadConfirmation": "Download Ŋuɖoɖo",
  },
};

const languageNames: Record<Language, string> = {
  en: "English",
  fr: "Français",
  tw: "Twi",
  ga: "Ga",
  ee: "Ewe",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("gis-language");
    return (saved as Language) || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("gis-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export { languageNames };
