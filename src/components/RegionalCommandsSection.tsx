import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Plane, Ship, Clock, Phone } from "lucide-react";

const specialCommands = [
  {
    name: "KIA Regional Command",
    location: "Kotoka International Airport, Accra",
    type: "Airport",
    icon: Plane,
    description: "Manages immigration services at Ghana's main international airport, handling passenger arrivals, departures, and transit.",
    services: ["Passport Control", "Visa on Arrival", "Transit Services", "Airport Security"],
  },
  {
    name: "Tema Regional Command",
    location: "Tema Port, Greater Accra",
    type: "Seaport",
    icon: Ship,
    description: "Oversees immigration operations at Ghana's largest seaport, including crew documentation and cargo vessel clearance.",
    services: ["Crew Documentation", "Vessel Clearance", "Port Security", "Seafarer Services"],
  },
];

const regionalCommands = [
  { region: "Greater Accra Region", headquarters: "Accra", borderPosts: 3 },
  { region: "Ashanti Region", headquarters: "Kumasi", borderPosts: 2 },
  { region: "Western Region", headquarters: "Sekondi-Takoradi", borderPosts: 4 },
  { region: "Central Region", headquarters: "Cape Coast", borderPosts: 2 },
  { region: "Eastern Region", headquarters: "Koforidua", borderPosts: 3 },
  { region: "Volta Region", headquarters: "Ho", borderPosts: 5 },
  { region: "Northern Region", headquarters: "Tamale", borderPosts: 4 },
  { region: "Upper East Region", headquarters: "Bolgatanga", borderPosts: 6 },
  { region: "Upper West Region", headquarters: "Wa", borderPosts: 5 },
  { region: "Bono Region", headquarters: "Sunyani", borderPosts: 2 },
  { region: "Bono East Region", headquarters: "Techiman", borderPosts: 2 },
  { region: "Ahafo Region", headquarters: "Goaso", borderPosts: 1 },
  { region: "Western North Region", headquarters: "Sefwi Wiawso", borderPosts: 3 },
  { region: "Oti Region", headquarters: "Dambai", borderPosts: 4 },
  { region: "North East Region", headquarters: "Nalerigu", borderPosts: 3 },
  { region: "Savannah Region", headquarters: "Damongo", borderPosts: 4 },
];

export const RegionalCommandsSection = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="secondary" className="mb-4">
          <MapPin className="w-3 h-3 mr-1" />
          Nationwide Presence
        </Badge>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
          Regional Commands
        </h2>
        <p className="text-muted-foreground">
          The Ghana Immigration Service maintains a strong presence across all 16 regions of Ghana, with specialized commands at major entry points.
        </p>
      </div>

      {/* Special Commands */}
      <div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Special Entry Point Commands
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {specialCommands.map((command, index) => (
            <Card key={index} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <command.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-foreground">{command.name}</h4>
                    <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {command.location}
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-4">{command.description}</p>
                <div className="flex flex-wrap gap-2">
                  {command.services.map((service, sIndex) => (
                    <Badge key={sIndex} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Regional Commands Grid */}
      <div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Regional Offices
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regionalCommands.map((command, index) => (
            <Card
              key={index}
              className="group border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {command.borderPosts} Posts
                  </Badge>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                  {command.region}
                </h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  HQ: {command.headquarters}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">
              Regional Office Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Monday - Friday: 8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Saturday: 9:00 AM - 1:00 PM (Select offices)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Airport & Seaport: 24/7 Operations</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">
              Contact Regional Offices
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              For specific inquiries about regional services, please contact the respective regional command or visit our main contact page.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">General Inquiries: +233 302 258 250</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
