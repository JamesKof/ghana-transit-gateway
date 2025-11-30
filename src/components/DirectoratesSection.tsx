import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Briefcase, 
  Scale, 
  CheckCircle,
  Users,
  FileSearch,
  Landmark,
  ClipboardList,
  BookOpen,
  Eye
} from "lucide-react";

const directorates = [
  {
    name: "Operations Directorate",
    icon: Shield,
    description: "The Operations Directorate is responsible for all field operations of the Ghana Immigration Service, including border management, enforcement activities, and investigation of immigration-related offenses.",
    color: "from-primary to-primary/70",
    functions: [
      { icon: Shield, title: "Border Management", description: "Manning and managing all entry and exit points including airports, seaports, and land borders" },
      { icon: Users, title: "Enforcement Operations", description: "Conducting enforcement activities against illegal immigration and related offenses" },
      { icon: FileSearch, title: "Investigation Unit", description: "Investigating immigration fraud, human trafficking, and smuggling cases" },
      { icon: Eye, title: "Intelligence Gathering", description: "Collecting and analyzing intelligence on cross-border criminal activities" },
    ],
  },
  {
    name: "Finance and Administration Directorate",
    icon: Briefcase,
    description: "The Finance and Administration Directorate manages all financial operations, human resources, procurement, logistics, and administrative functions of the Service.",
    color: "from-secondary to-secondary/70",
    functions: [
      { icon: Landmark, title: "Budget Management", description: "Preparing and managing the Service's annual budget and financial planning" },
      { icon: Users, title: "Human Resources", description: "Recruitment, training, welfare, and career development of personnel" },
      { icon: ClipboardList, title: "Procurement & Logistics", description: "Procurement of goods and services, fleet management, and logistics support" },
      { icon: Briefcase, title: "Administration", description: "General administrative functions, records management, and facilities maintenance" },
    ],
  },
  {
    name: "Legal, Research and Monitoring Directorate",
    icon: Scale,
    description: "The Legal, Research and Monitoring Directorate provides legal services, conducts research on immigration matters, and monitors compliance with immigration laws and policies.",
    color: "from-accent to-accent/70",
    functions: [
      { icon: Scale, title: "Legal Services", description: "Providing legal advice, handling litigation, and drafting legal documents" },
      { icon: BookOpen, title: "Policy Research", description: "Conducting research on immigration trends, policies, and best practices" },
      { icon: Eye, title: "Compliance Monitoring", description: "Monitoring adherence to immigration laws, policies, and international standards" },
      { icon: FileSearch, title: "Documentation Review", description: "Reviewing and authenticating immigration documents and applications" },
    ],
  },
];

export const DirectoratesSection = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="secondary" className="mb-4">
          <Briefcase className="w-3 h-3 mr-1" />
          Organizational Units
        </Badge>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
          Directorates
        </h2>
        <p className="text-muted-foreground">
          The Ghana Immigration Service operates through three main directorates, each responsible for specific functions critical to the Service's mandate.
        </p>
      </div>

      <div className="space-y-8">
        {directorates.map((directorate, index) => (
          <Card key={index} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader className={`bg-gradient-to-r ${directorate.color} text-primary-foreground`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <directorate.icon className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{directorate.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {directorate.description}
              </p>
              
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Key Functions
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {directorate.functions.map((func, funcIndex) => (
                  <div
                    key={funcIndex}
                    className="flex gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <func.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground text-sm mb-1">{func.title}</h5>
                      <p className="text-xs text-muted-foreground">{func.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
