import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowLeft, LogOut } from "lucide-react";
import { Layout } from "@/components/Layout";

interface Leader {
  id: string;
  name: string;
  title: string;
  role: string;
  description: string;
  full_bio: string;
  phone: string;
  email: string;
  office: string;
  image_url: string | null;
  display_order: number;
}

const AdminLeadership = () => {
  const [leadership, setLeadership] = useState<Leader[]>([]);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const emptyLeader: Partial<Leader> = {
    name: "",
    title: "",
    role: "",
    description: "",
    full_bio: "",
    phone: "",
    email: "",
    office: "",
    image_url: "",
    display_order: 0,
  };

  useEffect(() => {
    checkAuth();
    fetchLeadership();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchLeadership = async () => {
    const { data, error } = await supabase
      .from("leadership_profiles")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load leadership profiles",
        variant: "destructive",
      });
    } else {
      setLeadership(data || []);
    }
  };

  const handleSave = async () => {
    if (!editingLeader) return;

    setLoading(true);
    try {
      if (editingLeader.id) {
        const { error } = await supabase
          .from("leadership_profiles")
          .update(editingLeader)
          .eq("id", editingLeader.id);

        if (error) throw error;
        toast({ title: "Success", description: "Profile updated successfully" });
      } else {
        const { error } = await supabase
          .from("leadership_profiles")
          .insert([editingLeader]);

        if (error) throw error;
        toast({ title: "Success", description: "Profile created successfully" });
      }

      fetchLeadership();
      setIsDialogOpen(false);
      setEditingLeader(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    const { error } = await supabase
      .from("leadership_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Profile deleted successfully" });
      fetchLeadership();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Button variant="ghost" onClick={() => navigate("/leadership")} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leadership
              </Button>
              <h1 className="text-3xl font-bold">Manage Leadership Profiles</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setEditingLeader(emptyLeader as Leader); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((leader) => (
              <Card key={leader.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{leader.title}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditingLeader(leader); setIsDialogOpen(true); }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(leader.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLeader?.id ? "Edit Profile" : "Add New Profile"}
              </DialogTitle>
            </DialogHeader>
            {editingLeader && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editingLeader.name}
                      onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editingLeader.title}
                      onChange={(e) => setEditingLeader({ ...editingLeader, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={editingLeader.role}
                    onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editingLeader.description}
                    onChange={(e) => setEditingLeader({ ...editingLeader, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Biography</Label>
                  <Textarea
                    value={editingLeader.full_bio}
                    onChange={(e) => setEditingLeader({ ...editingLeader, full_bio: e.target.value })}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editingLeader.phone}
                      onChange={(e) => setEditingLeader({ ...editingLeader, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editingLeader.email}
                      onChange={(e) => setEditingLeader({ ...editingLeader, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Office Location</Label>
                  <Input
                    value={editingLeader.office}
                    onChange={(e) => setEditingLeader({ ...editingLeader, office: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editingLeader.image_url || ""}
                      onChange={(e) => setEditingLeader({ ...editingLeader, image_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={editingLeader.display_order}
                      onChange={(e) => setEditingLeader({ ...editingLeader, display_order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminLeadership;
