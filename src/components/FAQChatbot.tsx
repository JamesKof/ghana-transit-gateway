import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Knowledge base for FAQ responses
const knowledgeBase: { keywords: string[]; response: string; category: string }[] = [
  {
    keywords: ["visa", "tourist", "visit", "tourism"],
    response: "For tourist visas to Ghana, you'll need: a valid passport (6+ months validity), completed application form, 2 passport photos, proof of accommodation, return ticket, and proof of sufficient funds (min. $50/day). Processing takes 5-10 business days. Apply online at gis.gov.gh or visit any GIS office.",
    category: "Tourist Visa",
  },
  {
    keywords: ["work permit", "employment", "working", "job"],
    response: "Work permits in Ghana require: valid passport, employment contract, company registration documents, educational certificates, police clearance, and medical certificate. Your employer must initiate the application. Processing takes 4-6 weeks. Fees vary by permit duration (1-3 years).",
    category: "Work Permit",
  },
  {
    keywords: ["residence permit", "resident", "living", "stay"],
    response: "Residence permits are for long-term stays in Ghana. Requirements include: valid passport, proof of accommodation, financial capability evidence, police clearance, and medical certificate. Types include: Work Residence, Business Residence, and Dependent Residence. Apply at GIS headquarters or regional offices.",
    category: "Residence Permit",
  },
  {
    keywords: ["passport", "ghana passport", "new passport", "renew"],
    response: "For Ghana passport services: New applications require birth certificate, 2 passport photos, and valid ID. Renewals need old passport and 2 photos. Processing: Regular (6 weeks) - GHS 100, Express (2 weeks) - GHS 200, Emergency (48 hours) - GHS 350. Apply at any GIS passport office.",
    category: "Passport Services",
  },
  {
    keywords: ["ecowas", "west africa", "regional"],
    response: "ECOWAS nationals enjoy visa-free entry to Ghana for up to 90 days. You'll need a valid ECOWAS travel certificate or national passport. For stays beyond 90 days, apply for a residence permit. Border registration is still required upon entry.",
    category: "ECOWAS Travel",
  },
  {
    keywords: ["business visa", "investor", "investment"],
    response: "Business visas allow commercial activities in Ghana. Requirements: invitation from Ghanaian company, business registration documents, bank statements, and travel itinerary. Valid for 60 days, extendable. For long-term business, consider the Ghana Investment Promotion Centre (GIPC) registration.",
    category: "Business Visa",
  },
  {
    keywords: ["student visa", "study", "education", "university"],
    response: "Student visas require: admission letter from recognized Ghanaian institution, valid passport, proof of financial support, medical certificate, and police clearance. Apply before arrival. Visa valid for duration of study, requires annual renewal. Students cannot work without separate work permit.",
    category: "Student Visa",
  },
  {
    keywords: ["extension", "extend", "renew visa", "overstay"],
    response: "Visa extensions must be applied for BEFORE expiry at any GIS office. Required: valid passport, current visa, application form, and extension fee. Overstaying incurs penalties of $100/day. Repeated violations may result in deportation and entry ban.",
    category: "Visa Extension",
  },
  {
    keywords: ["fee", "cost", "price", "payment", "how much"],
    response: "Common GIS fees: Tourist Visa - $60-150, Work Permit - $500-2000 (varies by duration), Residence Permit - $200-500/year, Passport (Regular) - GHS 100, Express Passport - GHS 200. Payments accepted via mobile money, bank transfer, or at GIS offices. Visit gis.gov.gh for complete fee schedule.",
    category: "Fees",
  },
  {
    keywords: ["track", "status", "application status", "check"],
    response: "Track your application: 1) Visit gis.gov.gh 2) Click 'Application Status' 3) Enter your reference number 4) View current status. You can also call our hotline at +233 302 224 445 or visit any GIS office with your receipt. SMS notifications are sent at each processing stage.",
    category: "Application Tracking",
  },
  {
    keywords: ["office", "location", "address", "where"],
    response: "GIS Headquarters: Independence Avenue, Accra. Regional offices in: Tema, Kumasi, Takoradi, Tamale, Ho, Koforidua, Cape Coast, Sunyani, and all border posts. Office hours: Mon-Fri 8:00 AM - 5:00 PM. Book appointments online for faster service.",
    category: "Office Locations",
  },
  {
    keywords: ["document", "required", "requirements", "need"],
    response: "General document requirements for most applications: 1) Valid passport (6+ months validity) 2) Completed application form 3) Passport-size photos 4) Proof of accommodation 5) Financial evidence 6) Return ticket (for visitors). Additional documents vary by visa/permit type. Check specific requirements at gis.gov.gh.",
    category: "Requirements",
  },
  {
    keywords: ["emergency", "urgent", "expedite", "fast"],
    response: "Emergency services available for: lost passports, urgent travel, medical emergencies. Contact GIS Emergency Line: +233 302 224 445 (24/7). Emergency passport processing: 48 hours at GHS 350. Bring supporting documents (travel ticket, medical certificate, etc.).",
    category: "Emergency Services",
  },
  {
    keywords: ["dual citizenship", "multiple", "two passports"],
    response: "Ghana allows dual citizenship for Ghanaians by birth and descent. Apply through GIS with: birth certificate, proof of Ghanaian parentage, current passport(s), and application fee. Processing takes 3-6 months. Dual citizens must enter/exit Ghana with Ghana passport.",
    category: "Dual Citizenship",
  },
  {
    keywords: ["transit", "layover", "stopover"],
    response: "Transit visas required for layovers exceeding 48 hours or leaving the airport. Apply online or at arrival (limited nationalities). Requirements: valid passport, onward ticket, and transit visa fee ($30). Visa-free transit available for some nationalities for airport stays under 48 hours.",
    category: "Transit Visa",
  },
  {
    keywords: ["hello", "hi", "hey", "help", "start"],
    response: "Hello! Welcome to the Ghana Immigration Service FAQ Assistant. I can help you with information about visas, permits, passports, and immigration procedures. What would you like to know about?",
    category: "Greeting",
  },
];

const suggestedQuestions = [
  "How do I apply for a tourist visa?",
  "What are work permit requirements?",
  "How much does a passport cost?",
  "How do I track my application?",
  "Where are GIS offices located?",
];

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm the GIS FAQ Assistant powered by AI. I can answer your questions about visas, permits, passports, and immigration procedures in Ghana. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Find matching knowledge base entry
    let bestMatch = knowledgeBase.find(kb =>
      kb.keywords.some(keyword => lowerQuery.includes(keyword))
    );

    if (bestMatch) {
      return bestMatch.response;
    }

    // Default response for unmatched queries
    return "I don't have specific information about that topic. For detailed assistance, please:\n\n• Visit gis.gov.gh for official information\n• Call our hotline: +233 302 224 445\n• Visit any GIS office\n• Use the Live Chat for real-time support\n\nIs there anything else I can help you with regarding visas, permits, or passports?";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = findBestResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Open FAQ Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-secondary-foreground" />
          </span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">GIS FAQ Assistant</h3>
                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-Powered Support
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.sender === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className="text-[10px] mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedQuestions.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about visas, permits, passports..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
