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
                    <p className="text-muted-foreground">+233 302 258250 / +233 302 221667</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email Address</p>
                    <a href="mailto:info@gis.gov.gh" className="text-primary hover:underline">info@gis.gov.gh</a>
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
                <div className="pt-4 border-t border-border">
                  <a 
                    href="https://gis.gov.gh/contact-us/" 
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
