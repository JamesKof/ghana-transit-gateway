import { useState } from "react";
import { Bell, Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const notificationTypes = [
  { id: "status", label: "Application Status Updates", description: "Get notified when your application status changes" },
  { id: "policy", label: "Policy Changes", description: "Important immigration policy updates and changes" },
  { id: "deadlines", label: "Deadline Reminders", description: "Reminders for permit renewals and document expiry" },
  { id: "news", label: "GIS News & Announcements", description: "General news and service announcements" },
];

export function EmailNotificationSignup() {
  const [email, setEmail] = useState("");
  const [applicationRef, setApplicationRef] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["status"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTypes.length === 0) {
      toast({
        title: "Select Notification Types",
        description: "Please select at least one notification type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - in production, this would call a Supabase edge function
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubscribed(true);

    toast({
      title: "Subscribed Successfully!",
      description: "You will receive email notifications for your selected preferences.",
    });
  };

  if (isSubscribed) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-xl text-foreground mb-2">You're Subscribed!</h3>
          <p className="text-muted-foreground mb-4">
            We'll send notifications to <strong>{email}</strong>
          </p>
          <Button variant="outline" onClick={() => setIsSubscribed(false)}>
            Update Preferences
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-foreground">Email Notifications</h3>
          <p className="text-sm text-muted-foreground">Stay updated on your applications</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <Label htmlFor="notify-email">Email Address *</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="notify-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Application Reference (Optional) */}
        <div>
          <Label htmlFor="notify-ref">Application Reference (Optional)</Label>
          <Input
            id="notify-ref"
            placeholder="e.g., GIS-2024-123456"
            value={applicationRef}
            onChange={(e) => setApplicationRef(e.target.value)}
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Link notifications to a specific application
          </p>
        </div>

        {/* Notification Types */}
        <div>
          <Label>Notification Preferences *</Label>
          <div className="space-y-3 mt-2">
            {notificationTypes.map(type => (
              <label
                key={type.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTypes.includes(type.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => toggleType(type.id)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 mr-2" />
              Subscribe to Notifications
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You can unsubscribe at any time. We respect your privacy and won't share your email.
        </p>
      </form>
    </div>
  );
}
