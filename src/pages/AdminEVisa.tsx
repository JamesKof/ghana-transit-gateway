import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Search, FileText, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EVisaApplication {
  id: string;
  reference_number: string;
  nationality: string;
  full_name: string;
  email: string;
  passport_number: string;
  travel_date: string;
  visa_type: string;
  purpose_of_visit: string;
  visa_fee_amount: number;
  payment_status: string;
  payment_reference: string | null;
  payment_verified_at: string | null;
  application_status: string;
  submitted_at: string;
  updated_at: string;
  metadata: any;
}

const AdminEVisa = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<EVisaApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<EVisaApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<EVisaApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to access this page");
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!roles || roles.role !== "admin") {
        toast.error("You don't have permission to access this page");
        navigate("/");
        return;
      }

      await fetchApplications();
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast.error("Access denied");
      navigate("/");
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("evisa_applications")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.application_status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.reference_number.toLowerCase().includes(query) ||
          app.full_name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.passport_number.toLowerCase().includes(query),
      );
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("evisa_applications")
        .update({ application_status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Application status updated successfully");
      await fetchApplications();
      setDetailsOpen(false);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      submitted: { variant: "default", icon: FileText },
      approved: { variant: "default", icon: CheckCircle2 },
      rejected: { variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="pt-28 pb-16 min-h-screen bg-background">
      <section className="container max-w-7xl">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary" />
              E-Visa Applications Dashboard
            </CardTitle>
            <CardDescription>
              Manage and review all e-visa applications submitted through the Ghana Immigration Service portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reference, name, email, or passport number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchApplications} variant="outline">
                Refresh
              </Button>
            </div>

            <div className="rounded-lg border">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading applications...</div>
              ) : filteredApplications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "No applications match your filters."
                    : "No e-visa applications submitted yet."}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>Visa Type</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs">{app.reference_number}</TableCell>
                        <TableCell>
                          <div className="font-medium">{app.full_name}</div>
                          <div className="text-xs text-muted-foreground">{app.email}</div>
                        </TableCell>
                        <TableCell>{app.nationality}</TableCell>
                        <TableCell className="text-sm">{app.visa_type}</TableCell>
                        <TableCell>
                          <Badge variant={app.payment_status === "paid" ? "default" : "secondary"}>
                            {formatCurrency(app.visa_fee_amount)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(app.application_status)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(app.submitted_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedApplication(app);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing {filteredApplications.length} of {applications.length} applications
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>E-Visa Application Details</DialogTitle>
            <DialogDescription>Reference: {selectedApplication?.reference_number}</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">{selectedApplication.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Nationality</p>
                  <p className="font-medium">{selectedApplication.nationality}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Passport Number</p>
                  <p className="font-medium">{selectedApplication.passport_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Travel Date</p>
                  <p className="font-medium">
                    {new Date(selectedApplication.travel_date).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Visa Type</p>
                  <p className="font-medium">{selectedApplication.visa_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Payment Status</p>
                  <Badge variant={selectedApplication.payment_status === "paid" ? "default" : "secondary"}>
                    {selectedApplication.payment_status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Payment Reference</p>
                  <p className="font-mono text-xs">{selectedApplication.payment_reference || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Purpose of Visit</p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedApplication.purpose_of_visit}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium mb-1">Submitted</p>
                  <p>{formatDate(selectedApplication.submitted_at)}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Last Updated</p>
                  <p>{formatDate(selectedApplication.updated_at)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Update Application Status</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateApplicationStatus(selectedApplication.id, "submitted")}
                    disabled={selectedApplication.application_status === "submitted"}
                  >
                    Mark as Submitted
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => updateApplicationStatus(selectedApplication.id, "approved")}
                    disabled={selectedApplication.application_status === "approved"}
                  >
                    Approve Application
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateApplicationStatus(selectedApplication.id, "rejected")}
                    disabled={selectedApplication.application_status === "rejected"}
                  >
                    Reject Application
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminEVisa;
