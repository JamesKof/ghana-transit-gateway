import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Crown, Award } from "lucide-react";

const leadership = [
  {
    name: "Comptroller-General of Immigration",
    title: "Head of Service",
    description: "The Comptroller-General is the administrative head of the Ghana Immigration Service, responsible for the overall management and strategic direction of the Service.",
    role: "Executive Head",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Deputy Comptroller-General (Operations)",
    title: "DCG Operations",
    description: "Oversees all operational activities including border management, enforcement, and investigation units across all entry points.",
    role: "Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Deputy Comptroller-General (Finance & Admin)",
    title: "DCG Finance & Administration",
    description: "Manages financial operations, human resources, procurement, and administrative functions of the Service.",
    role: "Finance & Admin",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
];

const gisCouncil = [
  { title: "Chairman", description: "Appointed by the President to oversee the governing council" },
  { title: "Comptroller-General", description: "Ex-officio member serving as head of the Service" },
  { title: "Representative - Ministry of Interior", description: "Ministerial representative for policy alignment" },
  { title: "Representative - Ministry of Finance", description: "Financial oversight and budgetary coordination" },
  { title: "Representative - Ministry of Foreign Affairs", description: "Diplomatic and international relations liaison" },
  { title: "Two Distinguished Citizens", description: "Appointed members from civil society" },
];

const managementCommittee = [
  { position: "Comptroller-General", function: "Chairs the committee and provides strategic leadership" },
  { position: "Deputy Comptroller-General (Operations)", function: "Leads operational planning and execution" },
  { position: "Deputy Comptroller-General (Finance & Admin)", function: "Oversees resource allocation and administration" },
  { position: "Director of Operations", function: "Coordinates field operations and enforcement" },
  { position: "Director of Finance", function: "Manages budgets and financial reporting" },
  { position: "Director of Human Resources", function: "Handles personnel and training matters" },
  { position: "Director of Legal Services", function: "Provides legal guidance and policy review" },
  { position: "Director of Research & Monitoring", function: "Conducts research and monitors compliance" },
];

export const LeadershipSection = () => {
  return (
    <div className="space-y-16">
      {/* Executive Leadership */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-4">
            <Crown className="w-3 h-3 mr-1" />
            Executive Leadership
          </Badge>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Service Leadership
          </h2>
          <p className="text-muted-foreground">
            The Ghana Immigration Service is led by experienced professionals committed to national security and efficient service delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {leadership.map((leader, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge variant="outline" className="mb-3 text-xs">
                  {leader.role}
                </Badge>
                <h3 className="font-semibold text-foreground mb-1">{leader.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{leader.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {leader.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* GIS Council */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            Governing Body
          </Badge>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            GIS Council
          </h2>
          <p className="text-muted-foreground">
            The GIS Council is the governing body responsible for policy direction and oversight of the Ghana Immigration Service as established by the Immigration Service Law, 2016 (Act 908).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gisCouncil.map((member, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{member.title}</h4>
                    <p className="text-xs text-muted-foreground">{member.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Management Committee */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            Management Team
          </Badge>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Management Committee
          </h2>
          <p className="text-muted-foreground">
            The Management Committee is responsible for the day-to-day administration and operational decisions of the Service.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-2 bg-primary/5 px-6 py-3 border-b border-border">
            <span className="font-semibold text-sm text-foreground">Position</span>
            <span className="font-semibold text-sm text-foreground">Function</span>
          </div>
          {managementCommittee.map((member, index) => (
            <div
              key={index}
              className={`grid grid-cols-2 px-6 py-4 ${
                index !== managementCommittee.length - 1 ? "border-b border-border/50" : ""
              } hover:bg-muted/30 transition-colors`}
            >
              <span className="font-medium text-sm text-foreground">{member.position}</span>
              <span className="text-sm text-muted-foreground">{member.function}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
