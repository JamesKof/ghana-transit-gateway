import { useState } from "react";
import { Calculator, DollarSign, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeeItem {
  name: string;
  amount: number;
  currency: "USD" | "GHS";
}

const serviceTypes = [
  { id: "tourist-single", label: "Tourist Visa (Single Entry)", baseFee: 60, currency: "USD" as const },
  { id: "tourist-multiple", label: "Tourist Visa (Multiple Entry)", baseFee: 100, currency: "USD" as const },
  { id: "business-single", label: "Business Visa (Single Entry)", baseFee: 80, currency: "USD" as const },
  { id: "business-multiple", label: "Business Visa (Multiple Entry)", baseFee: 150, currency: "USD" as const },
  { id: "transit", label: "Transit Visa", baseFee: 30, currency: "USD" as const },
  { id: "work-permit-1yr", label: "Work Permit (1 Year)", baseFee: 500, currency: "USD" as const },
  { id: "work-permit-2yr", label: "Work Permit (2 Years)", baseFee: 900, currency: "USD" as const },
  { id: "work-permit-3yr", label: "Work Permit (3 Years)", baseFee: 1200, currency: "USD" as const },
  { id: "residence-permit", label: "Residence Permit", baseFee: 300, currency: "USD" as const },
  { id: "passport-regular", label: "Passport (Regular)", baseFee: 100, currency: "GHS" as const },
  { id: "passport-express", label: "Passport (Express)", baseFee: 200, currency: "GHS" as const },
  { id: "passport-emergency", label: "Passport (Emergency 48hrs)", baseFee: 350, currency: "GHS" as const },
];

const processingOptions = [
  { id: "standard", label: "Standard Processing", multiplier: 1, days: "10-15 business days" },
  { id: "express", label: "Express Processing", multiplier: 1.5, days: "5-7 business days" },
  { id: "urgent", label: "Urgent Processing", multiplier: 2, days: "2-3 business days" },
];

const additionalServices = [
  { id: "courier", label: "Courier Delivery", fee: 50, currency: "GHS" as const },
  { id: "sms", label: "SMS Notifications", fee: 10, currency: "GHS" as const },
  { id: "document-review", label: "Document Pre-Review", fee: 30, currency: "USD" as const },
];

export function FeeCalculator() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [processingSpeed, setProcessingSpeed] = useState<string>("standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [applicants, setApplicants] = useState<number>(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const service = serviceTypes.find(s => s.id === selectedService);
  const processing = processingOptions.find(p => p.id === processingSpeed);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    if (!service || !processing) return { usd: 0, ghs: 0, breakdown: [] };

    const breakdown: FeeItem[] = [];
    let totalUSD = 0;
    let totalGHS = 0;

    // Base fee with processing multiplier
    const baseFeeWithProcessing = service.baseFee * processing.multiplier * applicants;
    if (service.currency === "USD") {
      totalUSD += baseFeeWithProcessing;
    } else {
      totalGHS += baseFeeWithProcessing;
    }
    breakdown.push({
      name: `${service.label} × ${applicants} (${processing.label})`,
      amount: baseFeeWithProcessing,
      currency: service.currency,
    });

    // Add-ons
    selectedAddons.forEach(addonId => {
      const addon = additionalServices.find(a => a.id === addonId);
      if (addon) {
        const addonTotal = addon.fee * applicants;
        if (addon.currency === "USD") {
          totalUSD += addonTotal;
        } else {
          totalGHS += addonTotal;
        }
        breakdown.push({
          name: `${addon.label} × ${applicants}`,
          amount: addonTotal,
          currency: addon.currency,
        });
      }
    });

    return { usd: totalUSD, ghs: totalGHS, breakdown };
  };

  const { usd, ghs, breakdown } = calculateTotal();

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-foreground">Fee Calculator</h3>
          <p className="text-sm text-muted-foreground">Estimate your application costs</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Service Type */}
        <div>
          <Label>Service Type *</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tourist-single">Tourist Visa (Single Entry) - $60</SelectItem>
              <SelectItem value="tourist-multiple">Tourist Visa (Multiple Entry) - $100</SelectItem>
              <SelectItem value="business-single">Business Visa (Single Entry) - $80</SelectItem>
              <SelectItem value="business-multiple">Business Visa (Multiple Entry) - $150</SelectItem>
              <SelectItem value="transit">Transit Visa - $30</SelectItem>
              <SelectItem value="work-permit-1yr">Work Permit (1 Year) - $500</SelectItem>
              <SelectItem value="work-permit-2yr">Work Permit (2 Years) - $900</SelectItem>
              <SelectItem value="work-permit-3yr">Work Permit (3 Years) - $1,200</SelectItem>
              <SelectItem value="residence-permit">Residence Permit - $300</SelectItem>
              <SelectItem value="passport-regular">Passport (Regular) - GHS 100</SelectItem>
              <SelectItem value="passport-express">Passport (Express) - GHS 200</SelectItem>
              <SelectItem value="passport-emergency">Passport (Emergency) - GHS 350</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of Applicants */}
        <div>
          <Label>Number of Applicants</Label>
          <div className="flex items-center gap-3 mt-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setApplicants(Math.max(1, applicants - 1))}
              disabled={applicants <= 1}
            >
              -
            </Button>
            <span className="w-12 text-center font-semibold text-lg">{applicants}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setApplicants(Math.min(10, applicants + 1))}
              disabled={applicants >= 10}
            >
              +
            </Button>
          </div>
        </div>

        {/* Processing Speed */}
        <div>
          <Label>Processing Speed</Label>
          <div className="grid grid-cols-1 gap-2 mt-1.5">
            {processingOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setProcessingSpeed(option.id)}
                className={`p-3 text-left rounded-lg border transition-all ${
                  processingSpeed === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.days}</span>
                </div>
                {option.multiplier > 1 && (
                  <span className="text-xs text-primary">+{((option.multiplier - 1) * 100).toFixed(0)}% fee</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <Label>Additional Services (Optional)</Label>
          <div className="space-y-2 mt-1.5">
            {additionalServices.map(addon => (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  selectedAddons.includes(addon.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground">{addon.label}</span>
                  <span className="text-sm font-medium text-primary">
                    {addon.currency === "USD" ? "$" : "GHS "}{addon.fee}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        {selectedService && (
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Total</span>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-xs text-primary hover:underline"
              >
                {showBreakdown ? "Hide" : "Show"} breakdown
              </button>
            </div>

            {showBreakdown && breakdown.length > 0 && (
              <div className="space-y-2 pb-3 border-b border-border">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground">
                      {item.currency === "USD" ? "$" : "GHS "}{item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1">
              {usd > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">USD Total</span>
                  <span className="text-2xl font-bold text-primary">${usd.toLocaleString()}</span>
                </div>
              )}
              {ghs > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">GHS Total</span>
                  <span className="text-2xl font-bold text-primary">GHS {ghs.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Fees are estimates and may vary. Final amounts will be confirmed upon application submission.
                Exchange rate: $1 ≈ GHS 15 (approximate).
              </p>
            </div>
          </div>
        )}

        <Button className="w-full" disabled={!selectedService}>
          <DollarSign className="w-4 h-4 mr-2" />
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
