import { NewsSection } from "@/components/NewsSection";
import { EmailNotificationSignup } from "@/components/EmailNotificationSignup";
import { Calendar, Tag } from "lucide-react";

const pressReleases = [
  {
    date: "November 15, 2024",
    title: "GIS Launches Enhanced Online Portal",
    excerpt: "The Ghana Immigration Service has unveiled its new online application portal, featuring improved user experience and faster processing times.",
  },
  {
    date: "November 10, 2024",
    title: "2025 Fee Schedule Announced",
    excerpt: "Updated fee schedules for all immigration services will take effect from January 1, 2025. View the complete list of changes.",
  },
  {
    date: "October 28, 2024",
    title: "Holiday Season Travel Advisory",
    excerpt: "Guidelines for travelers during the upcoming holiday season. Extended hours at Kotoka International Airport immigration counters.",
  },
];

const categories = [
  "All Updates",
  "Policy Changes",
  "Service Updates",
  "Travel Advisories",
  "Press Releases",
];

const News = () => {
  return (
    <div className="pt-24">
      <NewsSection />
      
      {/* Press Releases Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              Official Communications
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Press Releases
            </h2>
            <p className="text-muted-foreground">
              Official statements and communications from the Ghana Immigration Service
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {pressReleases.map((release, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">{release.date}</p>
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{release.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a
              href="https://gis.gov.gh/news/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View All Press Releases
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-background">
        <div className="container max-w-xl">
          <EmailNotificationSignup />
        </div>
      </section>
    </div>
  );
};

export default News;
