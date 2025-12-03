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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { Activity, BarChart3, Clock, PieChart as PieChartIcon } from "lucide-react";

interface EVisaApplication {
  id: string;
  reference_number: string;
  visa_type: string;
  application_status: string;
  submitted_at: string;
  updated_at: string;
}

const AdminEVisaAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<EVisaApplication[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
        .select("id, reference_number, visa_type, application_status, submitted_at, updated_at")
        .order("submitted_at", { ascending: true });

      if (error) throw error;

      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications for analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = applications.length;
  const approvedApplications = applications.filter(
    (app) => app.application_status === "approved",
  );
  const rejectedApplications = applications.filter(
    (app) => app.application_status === "rejected",
  );
  const pendingApplications = applications.filter((app) =>
    ["pending", "submitted"].includes(app.application_status),
  );

  const approvalRate = totalApplications
    ? ((approvedApplications.length / totalApplications) * 100).toFixed(1)
    : "0.0";

  const calculateAverageProcessingDays = (apps: EVisaApplication[]) => {
    if (!apps.length) return 0;

    const totalDays = apps.reduce((sum, app) => {
      const submitted = new Date(app.submitted_at).getTime();
      const updated = new Date(app.updated_at).getTime();
      const diffDays = (updated - submitted) / (1000 * 60 * 60 * 24);
      return sum + Math.max(diffDays, 0);
    }, 0);

    return totalDays / apps.length;
  };

  const avgProcessingApproved = calculateAverageProcessingDays(approvedApplications);
  const avgProcessingRejected = calculateAverageProcessingDays(rejectedApplications);

  const statusChartData = [
    { status: "Approved", count: approvedApplications.length, key: "approved" },
    { status: "Rejected", count: rejectedApplications.length, key: "rejected" },
    { status: "Pending / Submitted", count: pendingApplications.length, key: "pending" },
  ];

  const statusChartConfig = {
    approved: {
      label: "Approved",
      color: "hsl(var(--primary))",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--destructive))",
    },
    pending: {
      label: "Pending / Submitted",
      color: "hsl(var(--accent))",
    },
  } as const;

  const visaTypeCounts: Record<string, number> = {};
  applications.forEach((app) => {
    if (!app.visa_type) return;
    const key = app.visa_type;
    visaTypeCounts[key] = (visaTypeCounts[key] || 0) + 1;
  });

  const visaTypeData = Object.entries(visaTypeCounts).map(([type, count]) => ({
    visaType: type,
    count,
  }));

  const visaTypeChartConfig = {
    visas: {
      label: "Applications",
      color: "hsl(var(--primary))",
    },
  } as const;

  const getSubmissionsTimeline = () => {
    const daysBack = 30;
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - (daysBack - 1));

    const buckets: Record<string, number> = {};

    for (let i = 0; i < daysBack; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().split("T")[0];
      buckets[key] = 0;
    }

    applications.forEach((app) => {
      const dateKey = new Date(app.submitted_at).toISOString().split("T")[0];
      if (buckets[dateKey] !== undefined) {
        buckets[dateKey] += 1;
      }
    });

    return Object.entries(buckets).map(([date, count]) => ({
      date,
      count,
    }));
  };

  const submissionTimelineData = getSubmissionsTimeline();

  const submissionChartConfig = {
    submissions: {
      label: "Submissions",
      color: "hsl(var(--primary))",
    },
  } as const;

  return (
    <main className="pt-28 pb-16 min-h-screen bg-background">
      <section className="container max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-primary" />
              E-Visa Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor e-visa application volumes, approval rates, and processing times to optimize
              operations.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/evisa")}>
              Back to Applications
            </Button>
            <Button variant="outline" onClick={fetchApplications} disabled={loading}>
              Refresh Data
            </Button>
          </div>
        </header>

        <Separator />

        <section className="grid gap-4 md:grid-cols-4" aria-label="Key metrics">
          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalApplications}</p>
              <p className="text-xs text-muted-foreground mt-1">
                All-time applications submitted through the portal.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <PieChartIcon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{approvalRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {approvedApplications.length} approved, {rejectedApplications.length} rejected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Processing (Approved)</CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {avgProcessingApproved ? avgProcessingApproved.toFixed(1) : "-"}d
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                From submission to approval.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Processing (Rejected)</CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {avgProcessingRejected ? avgProcessingRejected.toFixed(1) : "-"}d
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                From submission to decision.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" aria-label="Charts">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Status Distribution
              </CardTitle>
              <CardDescription>Overview of application statuses.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ChartContainer config={statusChartConfig} className="h-[280px] w-full">
                <BarChart data={statusChartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="count" fill="var(--color-approved)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Popular Visa Types
              </CardTitle>
              <CardDescription>Top visa categories by application volume.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {visaTypeData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No visa type data available yet.</p>
              ) : (
                <ChartContainer config={visaTypeChartConfig} className="h-[280px] w-full">
                  <BarChart data={visaTypeData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="visaType" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="var(--color-visas)" radius={4} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-label="Submission timeline">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Submission Volume (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Identify peak submission periods to plan staffing and processing capacity.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ChartContainer config={submissionChartConfig} className="h-[320px] w-full">
                <LineChart data={submissionTimelineData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(5)}
                  />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-submissions)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
};

export default AdminEVisaAnalytics;
