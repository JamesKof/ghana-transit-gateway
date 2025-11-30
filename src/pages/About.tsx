import { AboutSection } from "@/components/AboutSection";
import { LeadershipSection } from "@/components/LeadershipSection";
import { DirectoratesSection } from "@/components/DirectoratesSection";
import { RegionalCommandsSection } from "@/components/RegionalCommandsSection";
import { GISStructureSection } from "@/components/GISStructureSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award, Globe, Shield, Calendar, Building, MapPin, Briefcase, Crown } from "lucide-react";

const milestones = [
  { year: "1963", event: "Ghana Immigration Service established under Ministry of Interior" },
  { year: "1989", event: "Elevated to a full government agency with autonomous operations" },
  { year: "2000", event: "Immigration Act 573 enacted, modernizing immigration framework" },
  { year: "2016", event: "Immigration Service Law (Act 908) passed, strengthening institutional mandate" },
  { year: "2020", event: "Digital transformation initiative launched for online services" },
  { year: "2024", event: "Enhanced biometric systems deployed at all major entry points" },
];

const statistics = [
  { icon: Users, value: "3,500+", label: "Personnel Nationwide" },
  { icon: Building, value: "16", label: "Regional Offices" },
  { icon: Globe, value: "37", label: "Border Posts" },
  { icon: Award, value: "60+", label: "Years of Service" },
];

const About = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              About GIS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Ghana Immigration Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Regulating migration for national security and development since 1963
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-padding bg-primary">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 rounded-2xl p-6 text-center backdrop-blur-sm"
              >
                <stat.icon className="w-10 h-10 text-secondary mx-auto mb-4" />
                <p className="text-4xl font-bold text-primary-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-xl mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Building className="w-4 h-4" />
                <span className="hidden sm:inline">Structure</span>
              </TabsTrigger>
              <TabsTrigger value="leadership" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Leadership</span>
              </TabsTrigger>
              <TabsTrigger value="directorates" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Directorates</span>
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Regional Commands</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AboutSection />
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-12">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                    Our Journey
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    Historical Milestones
                  </h2>
                  <p className="text-muted-foreground">
                    Over six decades of dedicated service to Ghana and its visitors
                  </p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                    
                    {milestones.map((milestone, index) => (
                      <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                        <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                          {milestone.year}
                        </div>
                        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex-1">
                          <p className="text-foreground">{milestone.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Our Commitment Card */}
                <div className="max-w-4xl mx-auto bg-card rounded-3xl p-8 md:p-12 border border-border shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                        Our Commitment
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        The Ghana Immigration Service remains committed to its mandate of regulating migration 
                        for national security and development. We strive to provide efficient, transparent, 
                        and professional services to all stakeholders while maintaining the highest standards 
                        of integrity and accountability.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our vision is to be a world-class immigration service, leveraging technology and 
                        innovation to enhance border security, facilitate legitimate travel, and contribute 
                        meaningfully to Ghana's socioeconomic development.
                      </p>
                      <p className="mt-6 text-primary font-semibold italic">
                        "Friendship with Vigilance"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="structure">
              <GISStructureSection />
            </TabsContent>

            <TabsContent value="leadership">
              <LeadershipSection />
            </TabsContent>

            <TabsContent value="directorates">
              <DirectoratesSection />
            </TabsContent>

            <TabsContent value="regional">
              <RegionalCommandsSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default About;
