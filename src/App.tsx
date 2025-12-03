import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import EVisa from "./pages/EVisa";
import EVisaStatus from "./pages/EVisaStatus";
import AdminEVisa from "./pages/AdminEVisa";
import AdminEVisaAnalytics from "./pages/AdminEVisaAnalytics";
import Permits from "./pages/Permits";
import News from "./pages/News";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Leadership from "./pages/Leadership";
import Auth from "./pages/Auth";
import AdminLeadership from "./pages/AdminLeadership";
import FeedbackDashboard from "./pages/FeedbackDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/e-visa" element={<Layout><EVisa /></Layout>} />
                <Route path="/e-visa/status" element={<Layout><EVisaStatus /></Layout>} />
                <Route path="/admin/evisa" element={<Layout><AdminEVisa /></Layout>} />
                <Route path="/admin/evisa/analytics" element={<Layout><AdminEVisaAnalytics /></Layout>} />
                <Route path="/permits" element={<Layout><Permits /></Layout>} />
                <Route path="/news" element={<Layout><News /></Layout>} />
                <Route path="/resources" element={<Layout><Resources /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
                <Route path="/leadership" element={<Layout><Leadership /></Layout>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/leadership" element={<Layout><AdminLeadership /></Layout>} />
                <Route path="/admin/feedback" element={<Layout><FeedbackDashboard /></Layout>} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </Router>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
