import { useState } from "react";
import { Search, FileText, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ApplicationStatus = "pending" | "processing" | "approved" | "rejected" | null;

interface StatusResult {
  referenceNumber: string;
  applicantName: string;
  applicationType: string;
  submissionDate: string;
  status: ApplicationStatus;
  statusMessage: string;
  expectedCompletion?: string;
}

const mockStatuses: Record<string, StatusResult> = {
  "GIS2024001": {
    referenceNumber: "GIS2024001",
    applicantName: "John Doe",
    applicationType: "Work Permit",
    submissionDate: "2024-11-15",
    status: "processing",
    statusMessage: "Your application is currently being reviewed by our officers.",
    expectedCompletion: "2024-12-10",
  },
  "GIS2024002": {
    referenceNumber: "GIS2024002",
    applicantName: "Jane Smith",
    applicationType: "Tourist Visa",
    submissionDate: "2024-11-20",
    status: "approved",
    statusMessage: "Congratulations! Your visa has been approved. Please collect your passport.",
  },
  "GIS2024003": {
    referenceNumber: "GIS2024003",
    applicantName: "Mike Johnson",
    applicationType: "Residence Permit",
    submissionDate: "2024-11-01",
    status: "pending",
    statusMessage: "Your application has been received and is awaiting review.",
    expectedCompletion: "2024-12-15",
  },
};

export function ApplicationStatusChecker() {
  const { toast } = useToast();
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!referenceNumber.trim()) {
      setError("Please enter a reference number");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const status = mockStatuses[referenceNumber.toUpperCase()];
      
      if (status) {
        setResult(status);
      } else {
        setError("No application found with this reference number. Please check and try again.");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-6 h-6 text-accent" />;
      case "processing":
        return <Clock className="w-6 h-6 text-secondary" />;
      case "pending":
        return <FileText className="w-6 h-6 text-muted-foreground" />;
      case "rejected":
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "approved":
        return "bg-accent/10 text-accent border-accent/20";
      case "processing":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "pending":
        return "bg-muted text-muted-foreground border-border";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Track Your Application
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Application Status Checker
            </h2>
            <p className="text-muted-foreground">
              Enter your reference number to check the status of your visa or permit application.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter reference number (e.g., GIS2024001)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Check Status"
                )}
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </form>

          {/* Demo Reference Numbers */}
          <div className="mb-8 p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-2">Demo reference numbers to try:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(mockStatuses).map((ref) => (
                <button
                  key={ref}
                  type="button"
                  onClick={() => setReferenceNumber(ref)}
                  className="px-3 py-1 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden animate-fade-up min-h-[400px] flex flex-col">
              {/* Status Header */}
              <div className={`p-8 border-b ${getStatusColor(result.status)} flex-shrink-0`}>
                <div className="flex items-center gap-4">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="text-sm font-medium opacity-80">Application Status</p>
                    <p className="text-3xl font-bold capitalize">{result.status}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 space-y-4 flex-grow">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
                    <p className="font-semibold text-lg text-foreground">{result.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Application Type</p>
                    <p className="font-semibold text-lg text-foreground">{result.applicationType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Applicant Name</p>
                    <p className="font-semibold text-lg text-foreground">{result.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submission Date</p>
                    <p className="font-semibold text-lg text-foreground">{result.submissionDate}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Status Message</p>
                  <p className="text-foreground leading-relaxed">{result.statusMessage}</p>
                </div>

                {result.expectedCompletion && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Expected completion: <span className="text-foreground font-medium">{result.expectedCompletion}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-8 bg-muted/30 border-t border-border flex-shrink-0">
                <p className="text-sm text-muted-foreground mb-3">Need assistance?</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="tel:+233302224445">Call Front Desk</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:info@ghanaimmigration.org">Send Email</a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
