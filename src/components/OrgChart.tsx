import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/hooks/useScrollAnimation";
import { Users, Building2 } from "lucide-react";

const orgStructure = {
  head: {
    title: "Comptroller-General",
    subtitle: "Head of Service",
  },
  deputies: [
    { title: "DCG Operations", subtitle: "Deputy Comptroller-General" },
    { title: "DCG Finance & Admin", subtitle: "Deputy Comptroller-General" },
  ],
  directors: [
    { title: "Operations", department: "Field Operations & Enforcement" },
    { title: "Finance", department: "Budget & Financial Management" },
    { title: "Human Resources", department: "Personnel & Training" },
    { title: "Legal Services", department: "Legal Advisory & Compliance" },
    { title: "Research & Monitoring", department: "Data Analysis & Policy" },
    { title: "ICT", department: "Technology & Systems" },
  ],
  units: [
    "Border Management",
    "Passport & Travel Documents",
    "Permits & Residence",
    "Enforcement & Investigations",
    "Regional Commands (16)",
    "Special Commands (KIA, Tema)",
  ],
};

export const OrgChart = () => {
  return (
    <div className="space-y-8">
      <ScrollReveal animation="fade-up">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" className="mb-4">
            <Building2 className="w-3 h-3 mr-1" />
            Organizational Structure
          </Badge>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            GIS Organizational Chart
          </h2>
          <p className="text-muted-foreground">
            The hierarchical structure of the Ghana Immigration Service showing the chain of command and key departments.
          </p>
        </div>
      </ScrollReveal>

      {/* Org Chart Visualization */}
      <ScrollReveal animation="fade-up" delay={100}>
        <div className="relative max-w-5xl mx-auto">
          {/* Head - Comptroller General */}
          <div className="flex justify-center mb-8">
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg w-64">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">{orgStructure.head.title}</h3>
                <p className="text-sm text-primary-foreground/80">{orgStructure.head.subtitle}</p>
              </CardContent>
            </Card>
          </div>

          {/* Connector Line */}
          <div className="flex justify-center mb-4">
            <div className="w-0.5 h-8 bg-border" />
          </div>
          
          {/* Horizontal Line */}
          <div className="flex justify-center mb-4">
            <div className="w-64 h-0.5 bg-border" />
          </div>

          {/* Deputies Row */}
          <div className="flex justify-center gap-8 mb-8">
            {orgStructure.deputies.map((deputy, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-border mb-2" />
                <Card className="bg-secondary/10 border-secondary/30 w-56">
                  <CardContent className="p-3 text-center">
                    <h4 className="font-semibold text-sm text-foreground">{deputy.title}</h4>
                    <p className="text-xs text-muted-foreground">{deputy.subtitle}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Connector to Directors */}
          <div className="flex justify-center mb-4">
            <div className="w-0.5 h-8 bg-border" />
          </div>

          {/* Directors Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {orgStructure.directors.map((director, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-3 text-center">
                  <h5 className="font-semibold text-xs text-foreground mb-1">Director of</h5>
                  <p className="text-sm font-medium text-primary">{director.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{director.department}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connector to Units */}
          <div className="flex justify-center mb-4">
            <div className="w-0.5 h-8 bg-border" />
          </div>

          {/* Operational Units */}
          <div className="bg-muted/30 rounded-2xl p-6">
            <h4 className="text-center font-semibold text-foreground mb-4">Operational Units & Commands</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {orgStructure.units.map((unit, index) => (
                <Badge key={index} variant="outline" className="text-xs py-1.5 px-3">
                  {unit}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
