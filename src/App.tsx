import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
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
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/permits" element={<Permits />} />
                <Route path="/news" element={<News />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/leadership" element={<AdminLeadership />} />
                <Route path="/admin/feedback" element={<FeedbackDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
