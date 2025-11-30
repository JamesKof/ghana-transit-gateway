import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  MapPin, 
  ArrowRight,
  Crown,
  Briefcase,
  Shield
} from "lucide-react";

const structureLevels = [
  {
    level: "Headquarters",
    icon: Building2,
    color: "bg-primary",
    description: "National headquarters in Accra providing strategic direction and policy formulation",
    units: [
      "Office of the Comptroller-General",
      "Office of the Deputy Comptroller-Generals",
      "Directorates (Operations, Finance & Admin, Legal)",
    ],
  },
  {
    level: "Regional Commands",
    icon: MapPin,
    color: "bg-secondary",
    description: "18 regional commands across Ghana managing local immigration services",
    units: [
      "Regional Command Headquarters",
      "District Immigration Offices",
      "Border Control Units",
    ],
  },
  {
    level: "Border Posts",
    icon: Shield,
    color: "bg-accent",
    description: "37 authorized entry points including airports, seaports, and land borders",
    units: [
      "Airport Immigration Units",
      "Seaport Immigration Units",
      "Land Border Posts",
    ],
  },
];

export const GISStructureSection = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="secondary" className="mb-4">
          <Building2 className="w-3 h-3 mr-1" />
          Organization
        </Badge>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
          GIS Structure
        </h2>
        <p className="text-muted-foreground">
          The Ghana Immigration Service operates through a hierarchical structure designed to ensure efficient service delivery and effective border management across the nation.
        </p>
      </div>

      {/* Organizational Hierarchy */}
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
        
        <div className="space-y-8">
          {structureLevels.map((level, index) => (
            <div key={index} className="relative">
              <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                <Card className="border-border/50 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className={`${level.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                        <level.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1 bg-primary-foreground/20 text-primary-foreground border-0">
                          Level {index + 1}
                        </Badge>
                        <h3 className="font-bold text-lg text-primary-foreground">{level.level}</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                    <div className="space-y-2">
                      {level.units.map((unit, uIndex) => (
                        <div key={uIndex} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-foreground">{unit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Center dot for timeline */}
              <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
            </div>
          ))}
        </div>
      </div>

      {/* Chain of Command */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <h3 className="font-serif text-xl font-bold text-foreground mb-6 text-center">
          Chain of Command
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {[
            { title: "Comptroller-General", icon: Crown, desc: "Head of Service" },
            { title: "Deputy CGs", icon: Users, desc: "Operations & Admin" },
            { title: "Directors", icon: Briefcase, desc: "Directorate Heads" },
            { title: "Regional Commanders", icon: MapPin, desc: "Regional Leadership" },
            { title: "Field Officers", icon: Shield, desc: "Frontline Staff" },
          ].map((item, index, arr) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-2">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {index < arr.length - 1 && (
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { value: "3,500+", label: "Personnel Nationwide", icon: Users },
          { value: "18", label: "Regional Commands", icon: MapPin },
          { value: "37", label: "Authorized Entry Points", icon: Shield },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
