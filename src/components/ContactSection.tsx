import { MapPin, Phone, Mail, Clock, Send, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const offices = [
  {
    name: "Headquarters",
    address: "Independence Avenue, P.O. Box 416, Accra",
    phone: "+233 302 258250",
    hours: "Mon - Fri: 8:00 AM - 5:00 PM",
  },
  {
    name: "Kotoka International Airport",
    address: "Airport Terminal 3, Accra",
    phone: "+233 302 776171",
    hours: "24/7 Operations",
  },
  {
    name: "Aflao Border Post",
    address: "Aflao, Volta Region",
    phone: "+233 362 020123",
    hours: "6:00 AM - 10:00 PM",
  },
  {
    name: "Elubo Border Post",
    address: "Elubo, Western Region",
    phone: "+233 312 020456",
    hours: "6:00 AM - 10:00 PM",
  },
];

// WhatsApp contact
const WHATSAPP_NUMBER = "233302224445";

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will respond shortly.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I would like to inquire about Ghana Immigration Service.")}`;

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary -z-10" />

      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Have questions or need assistance? Our team is ready to help you with your immigration inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="visa">Visa Inquiry</option>
                  <option value="permit">Permit Application</option>
                  <option value="status">Application Status</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <Button variant="hero" size="lg" className="w-full" type="submit">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info & Offices */}
          <div className="space-y-6">
            {/* Main Contact Card */}
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Headquarters Address</p>
                    <p className="text-muted-foreground">Independence Avenue, P.O. Box 416, Accra, Ghana</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone Numbers</p>
                    <p className="text-muted-foreground">+233 302 224445 / 221667 / 213401</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email Address</p>
                    <a href="mailto:info@ghanaimmigration.org" className="text-primary hover:underline">info@ghanaimmigration.org</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Working Hours</p>
                    <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
                
                {/* WhatsApp & Links */}
                <div className="pt-4 border-t border-border space-y-3">
                  <a 
                    href={whatsappUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="font-medium text-[#25D366]">Chat on WhatsApp</span>
                  </a>
                  <a 
                    href="https://gis.gov.gh/contact/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary font-medium flex items-center gap-2 hover:underline"
                  >
                    Visit Official Contact Page
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Regional Offices */}
            <div className="bg-primary rounded-3xl p-8">
              <h3 className="font-serif text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Key Service Points
              </h3>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <p className="font-semibold text-primary-foreground mb-1">{office.name}</p>
                    <p className="text-sm text-primary-foreground/70">{office.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-primary-foreground/60">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {office.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {office.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
