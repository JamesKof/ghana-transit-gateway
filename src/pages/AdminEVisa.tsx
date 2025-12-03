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
import { Search, FileText, CheckCircle2, XCircle, Clock, Eye, Download, FileImage, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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
  document_urls: any;
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
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDownloadingBulk, setIsDownloadingBulk] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTemplateType, setEmailTemplateType] = useState<"approved" | "rejected" | "docs_needed">("approved");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  const viewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('evisa-documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;

      if (data?.signedUrl) {
        setViewingDocument(data.signedUrl);
        setDocumentViewerOpen(true);
      }
    } catch (error) {
      console.error("Error viewing document:", error);
      toast.error("Failed to load document");
    }
  };

  const downloadDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('evisa-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one application");
      return;
    }

    setIsDownloadingBulk(true);
    toast.loading("Preparing documents for download...");

    try {
      const response = await supabase.functions.invoke("bulk-download-documents", {
        body: {
          applicationIds: Array.from(selectedIds),
        },
      });

      if (response.error) {
        throw response.error;
      }

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `evisa_documents_${timestamp}.zip`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded documents from ${selectedIds.size} applications`);
      setSelectedIds(new Set());
    } catch (error: any) {
      console.error("Bulk download error:", error);
      toast.error("Failed to download documents. Please try again.");
    } finally {
      setIsDownloadingBulk(false);
    }
  };

  const getEmailTemplateDefaults = (
    template: "approved" | "rejected" | "docs_needed",
    app: EVisaApplication,
  ) => {
    const base = {
      approved: {
        subject: `Your Ghana E-Visa Application Approved - Ref ${app.reference_number}`,
        body: `Dear ${app.full_name},\n\nWe are pleased to inform you that your Ghana e-visa application (reference ${app.reference_number}) has been APPROVED.\n\nVisa Type: ${app.visa_type}\nTravel Date: ${new Date(app.travel_date).toLocaleDateString("en-US")}\n\nPlease ensure you travel with all required documents used during your application.\n\nBest regards,\nGhana Immigration Service`,
      },
      rejected: {
        subject: `Update on Your Ghana E-Visa Application - Ref ${app.reference_number}`,
        body: `Dear ${app.full_name},\n\nWe regret to inform you that your Ghana e-visa application (reference ${app.reference_number}) has been REJECTED after careful review.\n\nIf you believe this decision was made in error or your circumstances have changed, you may submit a new application with updated information.\n\nBest regards,\nGhana Immigration Service`,
      },
      docs_needed: {
        subject: `Additional Documents Required - E-Visa Ref ${app.reference_number}`,
        body: `Dear ${app.full_name},\n\nDuring the review of your Ghana e-visa application (reference ${app.reference_number}), we identified that additional documents or clarifications are required to continue processing.\n\nPlease reply to this email or use the official GIS channels to provide the requested documents.\n\nBest regards,\nGhana Immigration Service`,
      },
    } as const;

    return base[template];
  };

  const openEmailDialog = (template: "approved" | "rejected" | "docs_needed") => {
    if (!selectedApplication) return;

    const defaults = getEmailTemplateDefaults(template, selectedApplication);
    setEmailTemplateType(template);
    setEmailSubject(defaults.subject);
    setEmailBody(defaults.body);
    setEmailDialogOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedApplication) return;
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please provide both a subject and message body.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const { error } = await supabase.functions.invoke("send-notification-email", {
        body: {
          type: "status_update",
          email: selectedApplication.email,
          applicationRef: selectedApplication.reference_number,
          data: {
            subject: emailSubject.trim(),
            message: emailBody.trim(),
            applicantName: selectedApplication.full_name,
            newStatus:
              emailTemplateType === "docs_needed"
                ? "Additional Information Required"
                : emailTemplateType.charAt(0).toUpperCase() + emailTemplateType.slice(1),
          },
        },
      });

      if (error) throw error;

      toast.success("Email notification sent to applicant");
      setEmailDialogOpen(false);
    } catch (error: any) {
      console.error("Error sending email notification:", error);
      toast.error("Failed to send email notification");
    } finally {
      setIsSendingEmail(false);
    }
  };

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

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedIds.size} application{selectedIds.size > 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBulkDownload}
                    disabled={isDownloadingBulk}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {isDownloadingBulk ? "Preparing..." : "Download All Documents"}
                  </Button>
                </div>
              </div>
            )}

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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedIds.size === filteredApplications.length && filteredApplications.length > 0}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
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
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(app.id)}
                            onCheckedChange={() => toggleSelection(app.id)}
                            aria-label={`Select ${app.reference_number}`}
                          />
                        </TableCell>
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

              {/* Document Viewer */}
              {selectedApplication.document_urls && selectedApplication.document_urls.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Uploaded Documents ({selectedApplication.document_urls.length})</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedApplication.document_urls.map((docPath, index) => {
                      const fileName = docPath.split('/').pop() || `Document ${index + 1}`;
                      const fileExt = fileName.split('.').pop()?.toLowerCase();
                      const isPDF = fileExt === 'pdf';
                      
                      return (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                          <FileImage className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fileName}</p>
                            <p className="text-xs text-muted-foreground">{isPDF ? 'PDF Document' : 'Image File'}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => viewDocument(docPath)}
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => downloadDocument(docPath)}
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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

              <div className="border-t pt-4 space-y-4">
                <div>
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

                <div className="space-y-2">
                  <p className="text-sm font-medium">Notify Applicant by Email</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEmailDialog("approved")}
                    >
                      Use "Approved" Template
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEmailDialog("rejected")}
                    >
                      Use "Rejected" Template
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEmailDialog("docs_needed")}
                    >
                      Request Additional Documents
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Templates can be customized before sending and will be emailed to {selectedApplication.email}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Notification Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Send Email Notification</DialogTitle>
            <DialogDescription>
              Customize and send an email update to the applicant about their e-visa application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Template</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={emailTemplateType === "approved" ? "default" : "outline"}
                  onClick={() => selectedApplication && openEmailDialog("approved")}
                >
                  Approved
                </Button>
                <Button
                  size="sm"
                  variant={emailTemplateType === "rejected" ? "default" : "outline"}
                  onClick={() => selectedApplication && openEmailDialog("rejected")}
                >
                  Rejected
                </Button>
                <Button
                  size="sm"
                  variant={emailTemplateType === "docs_needed" ? "default" : "outline"}
                  onClick={() => selectedApplication && openEmailDialog("docs_needed")}
                >
                  Additional Docs Needed
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Subject</p>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Message</p>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={8}
                placeholder="Write your message here..."
              />
              <p className="text-xs text-muted-foreground">
                This email will be sent to the applicant's address associated with the selected application.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
                disabled={isSendingEmail}
              >
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                {isSendingEmail ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={documentViewerOpen} onOpenChange={setDocumentViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              Preview uploaded passport scan or supporting document
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4 overflow-auto max-h-[calc(90vh-120px)]">
            {viewingDocument && (
              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                {viewingDocument.toLowerCase().includes(".pdf") ? (
                  <iframe
                    src={viewingDocument}
                    className="w-full h-[600px] rounded border"
                    title="PDF Document Viewer"
                  />
                ) : (
                  <img
                    src={viewingDocument}
                    alt="Uploaded document"
                    className="max-w-full h-auto rounded shadow-lg"
                  />
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminEVisa;
