import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, CreditCard, Globe2, ShieldCheck, ArrowRight, Upload, FileText, X, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

// TODO: Replace this test public key with your real Paystack public key.
// It is safe to keep the *public* key in frontend code.
const PAYSTACK_PUBLIC_KEY = "pk_test_replace_with_your_paystack_public_key";

const VISA_FEE_GHS = 100;

const eVisaSchema = z.object({
  nationality: z.string().min(1, "Please select your nationality."),
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  passportNumber: z
    .string()
    .min(5, "Enter a valid passport number.")
    .max(20, "Passport number is too long."),
  travelDate: z.string().min(1, "Select your intended arrival date."),
  visaType: z.string().min(1, "Select a visa type."),
  purposeOfVisit: z
    .string()
    .min(10, "Briefly describe your purpose of visit.")
    .max(500, "Please keep this under 500 characters."),
});

type EVisaFormValues = z.infer<typeof eVisaSchema>;

const nationalities = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "South Africa",
  "China",
  "India",
  "France",
  "Other",
];

const visaTypes = [
  "Single Entry - 30 Days",
  "Single Entry - 90 Days",
  "Multiple Entry - 6 Months",
];

const steps = [
  {
    id: 1,
    title: "Select nationality",
    description: "Confirm the country that issued your passport.",
  },
  {
    id: 2,
    title: "Complete application",
    description: "Provide basic contact and passport details.",
  },
  {
    id: 3,
    title: "Pay visa fee",
    description: "Pay securely online using Paystack.",
  },
] as const;

const EVisa = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPaying, setIsPaying] = useState(false);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<EVisaFormValues>({
    resolver: zodResolver(eVisaSchema),
    defaultValues: {
      nationality: "",
      fullName: "",
      email: "",
      passportNumber: "",
      travelDate: "",
      visaType: "",
      purposeOfVisit: "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    document.title = "Ghana e-Visa Application | Ghana Immigration Service";
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const goToDetailsStep = async () => {
    const valid = await form.trigger("nationality");
    if (valid) {
      setStep(2);
    }
  };

  const goToPaymentStep = async () => {
    const valid = await form.trigger([
      "fullName",
      "email",
      "passportNumber",
      "travelDate",
      "visaType",
      "purposeOfVisit",
      "nationality",
    ]);

    if (valid) {
      // Check if files are uploaded
      if (uploadedFiles.length === 0) {
        toast.error("Please upload at least one document (passport scan or supporting document)");
        return;
      }
      
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} has an invalid type. Only JPG, PNG, and PDF are allowed.`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePayWithPaystack = async () => {
    const valid = await form.trigger();
    if (!valid) {
      setStep(2);
      toast.error("Please complete all required fields before payment.");
      return;
    }

    if (!window.PaystackPop) {
      toast.error("Payment system is still loading. Please try again in a moment.");
      return;
    }

    const values = form.getValues();

    setIsPaying(true);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: values.email,
      amount: VISA_FEE_GHS * 100,
      currency: "GHS",
      ref: `GIS-EVISA-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: values.fullName },
          { display_name: "Nationality", variable_name: "nationality", value: values.nationality },
          { display_name: "Visa Type", variable_name: "visa_type", value: values.visaType },
          { display_name: "Travel Date", variable_name: "travel_date", value: values.travelDate },
        ],
      },
      callback: async (response: any) => {
        setIsPaying(false);
        const paymentRef = response.reference;
        
        toast.loading("Uploading documents and verifying payment...");

        try {
          // Upload files to storage first
          const documentUrls: string[] = [];
          setIsUploading(true);

          for (const file of uploadedFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${paymentRef}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('evisa-documents')
              .upload(filePath, file);

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw new Error(`Failed to upload ${file.name}`);
            }

            documentUrls.push(filePath);
          }

          setIsUploading(false);

          // Now submit the application with document URLs
          const { data, error } = await supabase.functions.invoke("verify-evisa-payment", {
            body: {
              nationality: values.nationality,
              fullName: values.fullName,
              email: values.email,
              passportNumber: values.passportNumber,
              travelDate: values.travelDate,
              visaType: values.visaType,
              purposeOfVisit: values.purposeOfVisit,
              paymentReference: paymentRef,
              visaFeeAmount: VISA_FEE_GHS,
              documentUrls,
            },
          });

          if (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed. Please contact support with your payment reference: " + paymentRef);
            return;
          }

          if (!data.success) {
            toast.error(data.error || "Failed to submit application. Please contact support.");
            return;
          }

          setTransactionRef(paymentRef);
          toast.success(`Application submitted successfully! Your reference: ${data.referenceNumber}`);
        } catch (err) {
          console.error("Submission error:", err);
          toast.error("An error occurred. Please contact support with your payment reference: " + paymentRef);
        } finally {
          setIsUploading(false);
        }
      },
      onClose: () => {
        setIsPaying(false);
        toast.message("You closed the payment window before completing the transaction.");
      },
    });

    handler.openIframe();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <main className="pt-28 pb-16 bg-gradient-to-b from-background-mint via-background to-background-mint">
      <section className="container max-w-5xl">
        <header className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <Globe2 className="w-4 h-4" /> Ghana e-Visa Application
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Apply for your Ghana e-Visa online
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Start your secure online application in three simple steps: choose nationality, complete details, and pay
            safely with Paystack.
          </p>
        </header>

        <ol className="mb-10 grid gap-4 md:grid-cols-3" aria-label="Application steps">
          {steps.map((item) => {
            const isCompleted = step > item.id;
            const isCurrent = step === item.id;

            return (
              <li key={item.id}>
                <Card
                  className={`h-full border-2 transition-all duration-300 ${
                    isCurrent
                      ? "border-primary shadow-lg"
                      : isCompleted
                        ? "border-emerald-500/70 bg-card/95"
                        : "border-border bg-card/90"
                  }`}
                >
                  <CardHeader className="flex-row items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                        isCompleted
                          ? "bg-emerald-500 text-emerald-50"
                          : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.id}
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">Step {item.id}</h2>
                      <p className="text-sm text-muted-foreground leading-tight">{item.title}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>

        <Form {...form}>
          <div className="space-y-10">
            {step === 1 && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Globe2 className="w-6 h-6 text-primary" />
                    Step 1: Select your nationality
                  </CardTitle>
                  <CardDescription>
                    Confirm the country that issued your passport to see if you are eligible to apply for a Ghana
                    e-visa online.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your nationality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nationalities.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col justify-between rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Before you start</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Ensure your passport is valid for at least 6 months.</li>
                        <li>Have a clear copy of your bio-data page ready.</li>
                        <li>You will pay the visa fee online in Ghana Cedis (GHS).</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button type="button" onClick={goToDetailsStep}>
                    Continue to application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    Step 2: Traveller & passport details
                  </CardTitle>
                  <CardDescription>
                    Provide accurate information exactly as it appears on your passport. You will review these details
                    before making payment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="passportNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport number</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g. A1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="travelDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intended arrival date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="visaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visa type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visa type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {visaTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="purposeOfVisit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of visit</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="E.g. Tourism, business meetings, conference attendance, visiting family, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Required Documents</label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Upload your passport bio-data page and any supporting documents (Max 5MB per file, JPG/PNG/PDF only)
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-primary hover:underline">
                          Click to upload
                        </span>
                        <span className="text-sm text-muted-foreground"> or drag and drop</span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleFileSelect}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG or PDF (max 5MB per file)
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{uploadedFiles.length} file(s) selected:</p>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-3 flex-wrap">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToPaymentStep}>
                    Review & proceed to payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                    Step 3: Pay visa fee securely
                  </CardTitle>
                  <CardDescription>
                    Review your application summary below, then complete payment using Paystack to submit your e-visa
                    application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3 text-sm">
                      <h2 className="font-semibold text-foreground">Traveller details</h2>
                      <p className="text-muted-foreground"><span className="font-medium">Full name:</span> {watchedValues.fullName || "—"}</p>
                      <p className="text-muted-foreground"><span className="font-medium">Email:</span> {watchedValues.email || "—"}</p>
                      <p className="text-muted-foreground"><span className="font-medium">Nationality:</span> {watchedValues.nationality || "—"}</p>
                      <p className="text-muted-foreground"><span className="font-medium">Passport number:</span> {watchedValues.passportNumber || "—"}</p>
                      <p className="text-muted-foreground"><span className="font-medium">Intended arrival:</span> {watchedValues.travelDate || "—"}</p>
                      <p className="text-muted-foreground"><span className="font-medium">Visa type:</span> {watchedValues.visaType || "—"}</p>
                    </div>

                    <div className="space-y-4 rounded-xl bg-muted/60 p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Visa fee</span>
                        <span className="font-semibold text-primary">{formatCurrency(VISA_FEE_GHS)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The fee shown is indicative and may be updated in line with official Ghana Immigration Service
                        regulations.
                      </p>
                      <ul className="space-y-1 list-disc list-inside text-xs text-muted-foreground">
                        <li>Secure payment is processed by Paystack.</li>
                        <li>No card details are stored by this website.</li>
                        <li>You will receive a confirmation email after successful payment.</li>
                      </ul>
                    </div>
                  </div>

                  {transactionRef && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">Payment successful</p>
                          <p className="text-muted-foreground">
                            Your e-visa application has been received. Keep this reference for your records:
                          </p>
                          <p className="mt-1 font-mono text-xs text-foreground bg-muted px-2 py-1 rounded inline-block">
                            {transactionRef}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Search className="w-4 h-4 text-primary" />
                          Track Your Application
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          You can check your application status anytime using your reference number.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/e-visa/status">
                            Check Application Status
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between gap-3 flex-wrap">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={isPaying}>
                    Back
                  </Button>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handlePayWithPaystack}
                      disabled={isPaying || Boolean(transactionRef)}
                    >
                      {transactionRef ? (
                        "Payment completed"
                      ) : (
                        <>
                          Pay {formatCurrency(VISA_FEE_GHS)} with Paystack
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    {!transactionRef && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        You will be redirected to a secure Paystack payment window.
                      </p>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </Form>
      </section>
    </main>
  );
};

export default EVisa;
