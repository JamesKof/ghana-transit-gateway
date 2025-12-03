import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const statusSchema = z.object({
  referenceNumber: z.string().min(1, "Please enter your reference number"),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const EVisaStatus = () => {
  const [application, setApplication] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      referenceNumber: "",
    },
  });

  const onSubmit = async (values: StatusFormValues) => {
    setIsSearching(true);
    setApplication(null);

    try {
      const { data, error } = await supabase
        .from("evisa_applications")
        .select("*")
        .eq("reference_number", values.referenceNumber.trim().toUpperCase())
        .maybeSingle();

      if (error) {
        console.error("Error fetching application:", error);
        toast.error("An error occurred while searching. Please try again.");
        return;
      }

      if (!data) {
        toast.error("No application found with this reference number.");
        return;
      }

      setApplication(data);
      toast.success("Application found!");
    } catch (err) {
      console.error("Search error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
      case "submitted":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <main className="pt-28 pb-16 bg-gradient-to-b from-background-mint via-background to-background-mint min-h-screen">
      <section className="container max-w-4xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Search className="w-4 h-4" /> Track E-Visa Application
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Check Your Application Status
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Enter your reference number to view the current status of your e-visa application.
          </p>
        </header>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Reference Number</CardTitle>
            <CardDescription>
              Your reference number was provided in the confirmation email after submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g. EVISA-1234567890-ABCDEF"
                            className="flex-1 uppercase"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <Button type="submit" disabled={isSearching}>
                          {isSearching ? (
                            <>Searching...</>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Search
                            </>
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Application Details */}
        {application && (
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Application Details</CardTitle>
                  <CardDescription className="mt-1">
                    Reference: {application.reference_number}
                  </CardDescription>
                </div>
                {getStatusBadge(application.application_status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Application Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Status Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Application Status</p>
                    {getStatusBadge(application.application_status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    {getPaymentStatusBadge(application.payment_status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Submitted On</p>
                    <p className="text-sm font-medium">
                      {new Date(application.submitted_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {new Date(application.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Applicant Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-sm font-medium">{application.full_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{application.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="text-sm font-medium">{application.nationality}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Passport Number</p>
                    <p className="text-sm font-medium">{application.passport_number}</p>
                  </div>
                </div>
              </div>

              {/* Visa Details */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Visa Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Visa Type</p>
                    <p className="text-sm font-medium">{application.visa_type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Travel Date</p>
                    <p className="text-sm font-medium">
                      {new Date(application.travel_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Visa Fee</p>
                    <p className="text-sm font-medium">
                      GHS {application.visa_fee_amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Reference</p>
                    <p className="text-sm font-medium break-all">
                      {application.payment_reference || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purpose of Visit */}
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-semibold text-lg">Purpose of Visit</h3>
                <p className="text-sm text-muted-foreground">{application.purpose_of_visit}</p>
              </div>

              {/* Status Message */}
              <div className="pt-4 border-t">
                {application.application_status.toLowerCase() === "approved" && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                          Visa Approved!
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                          Your e-visa has been approved. You will receive your visa document via email shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {application.application_status.toLowerCase() === "rejected" && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-100">
                          Application Rejected
                        </h4>
                        <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                          Unfortunately, your application was not approved. Please contact our support team for more information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {(application.application_status.toLowerCase() === "pending" ||
                  application.application_status.toLowerCase() === "submitted") && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex gap-3">
                      <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                          Under Review
                        </h4>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                          Your application is being reviewed by our team. Processing typically takes 3-5 business days. We'll email you when there's an update.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you have questions about your application or need assistance:
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Check your email for updates from Ghana Immigration Service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Contact our support team with your reference number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Processing times may vary during peak periods</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default EVisaStatus;
