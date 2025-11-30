import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { LiveChatWidget } from "./LiveChatWidget";
import { WhatsAppButton } from "./WhatsAppButton";
import { NotificationBanner } from "./NotificationBanner";
import { FAQChatbot } from "./FAQChatbot";
import { ScrollProgress } from "./ScrollProgress";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navigation />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <NotificationBanner />
      <FAQChatbot />
      <LiveChatWidget />
      <WhatsAppButton />
    </div>
  );
}
