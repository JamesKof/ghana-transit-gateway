import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Briefcase, Edit, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollReveal, StaggerReveal } from "@/hooks/useScrollAnimation";
import { Layout } from "@/components/Layout";

interface Leader {
  id: string;
  name: string;
  title: string;
  description: string;
  role: string;
  image_url: string | null;
  full_bio: string;
  phone: string;
  email: string;
  office: string;
  display_order: number;
}

const Leadership = () => {
  const [leadership, setLeadership] = useState<Leader[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchLeadership();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();
      
      setIsAdmin(!!roles);
    }
  };

  const fetchLeadership = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leadership_profiles")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setLeadership(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load leadership profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="relative py-24 px-4 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="container mx-auto relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <Badge variant="secondary" className="mb-4">
                  <Crown className="w-3 h-3 mr-1" />
                  Executive Leadership
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Leadership Team
                </h1>
                <p className="text-lg text-muted-foreground">
                  Meet the dedicated leaders steering the Ghana Immigration Service towards excellence in border security, facilitation, and migration management.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Leadership Grid */}
        <div className="container mx-auto px-4 py-16">
          {isAdmin && (
            <ScrollReveal>
              <div className="flex justify-end mb-6">
                <Button onClick={() => navigate("/admin/leadership")} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Manage Profiles
                </Button>
              </div>
            </ScrollReveal>
          )}

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 h-64 bg-muted/20" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <StaggerReveal>
                {leadership.map((leader, index) => (
                  <Card
                    key={leader.id}
                    className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-border/50 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedLeader(leader)}
                  >
                    <CardContent className="p-6 text-center">
                      {leader.image_url && (
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                          <img
                            src={leader.image_url}
                            alt={leader.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
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
              </StaggerReveal>
            </div>
          )}
        </div>

        {/* Leadership Profile Modal */}
        <Dialog open={!!selectedLeader} onOpenChange={() => setSelectedLeader(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Leadership Profile</DialogTitle>
            </DialogHeader>
            {selectedLeader && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  {selectedLeader.image_url && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-primary/30 shrink-0">
                      <img
                        src={selectedLeader.image_url}
                        alt={selectedLeader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {selectedLeader.role}
                    </Badge>
                    <h3 className="font-semibold text-foreground text-lg">
                      {selectedLeader.name}
                    </h3>
                    <p className="text-sm text-primary font-medium">{selectedLeader.title}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Biography
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedLeader.full_bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Contact Information</h4>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${selectedLeader.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedLeader.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${selectedLeader.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedLeader.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Office</p>
                      <p className="text-sm text-foreground">{selectedLeader.office}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Leadership;
