import { ContactSection } from "@/components/ContactSection";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { MapPin, Navigation } from "lucide-react";
import { ScrollReveal, StaggerReveal } from "@/hooks/useScrollAnimation";

const borderPosts = [
  { name: "Kotoka International Airport", location: "Accra", type: "Air" },
  { name: "Aflao", location: "Volta Region", type: "Land" },
  { name: "Elubo", location: "Western Region", type: "Land" },
  { name: "Paga", location: "Upper East Region", type: "Land" },
  { name: "Tema Harbour", location: "Greater Accra", type: "Sea" },
  { name: "Takoradi Harbour", location: "Western Region", type: "Sea" },
];

const Contact = () => {
  return (
    <div className="pt-24">
      <ScrollReveal animation="fade-up">
        <ContactSection />
      </ScrollReveal>
      
      {/* Appointment Booking */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                Book Your Visit
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Schedule an Appointment
              </h2>
              <p className="text-muted-foreground">
                Book an appointment at any GIS office for faster service
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="max-w-xl mx-auto">
              <AppointmentBooking />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Border Posts */}
      <section className="section-padding bg-background">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                Entry Points
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Major Border Posts
              </h2>
              <p className="text-muted-foreground">
                Ghana Immigration Service operates at all major air, land, and sea entry points
              </p>
            </div>
          </ScrollReveal>
          
          <StaggerReveal
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            staggerDelay={100}
            animation="fade-up"
          >
            {borderPosts.map((post, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    post.type === "Air" ? "bg-blue-100 text-blue-600" :
                    post.type === "Land" ? "bg-green-100 text-green-600" :
                    "bg-cyan-100 text-cyan-600"
                  }`}>
                    {post.type === "Air" ? "✈️" :
                     post.type === "Land" ? "🚗" : "🚢"}
                  </div>
                  <div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      post.type === "Air" ? "bg-blue-100 text-blue-700" :
                      post.type === "Land" ? "bg-green-100 text-green-700" :
                      "bg-cyan-100 text-cyan-700"
                    }`}>
                      {post.type}
                    </span>
                    <h3 className="font-semibold text-foreground mt-2">{post.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {post.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Map Embed Placeholder */}
      <ScrollReveal animation="fade-up">
        <section className="bg-muted/30">
          <div className="container py-8">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="aspect-[21/9] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Visit <a href="https://gis.gov.gh/contact/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gis.gov.gh</a> for interactive map and directions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default Contact;
