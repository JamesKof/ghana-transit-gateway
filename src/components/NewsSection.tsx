import { Calendar, ArrowRight, AlertTriangle, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    type: "alert",
    icon: AlertTriangle,
    title: "Warning: Beware of Recruitment Scams",
    date: "November 2024",
    summary: "The Ghana Immigration Service warns the public against fraudulent recruitment schemes. GIS does not charge fees for employment opportunities.",
    urgent: true,
  },
  {
    type: "announcement",
    icon: Bell,
    title: "Updated Visa Processing Guidelines",
    date: "October 2024",
    summary: "New streamlined procedures for visa applications now in effect. Check requirements before applying to ensure faster processing.",
    urgent: false,
  },
  {
    type: "news",
    icon: FileText,
    title: "Enhanced Border Security Measures",
    date: "October 2024",
    summary: "GIS implements advanced biometric verification systems at major border posts to improve security and facilitate legitimate travel.",
    urgent: false,
  },
  {
    type: "announcement",
    icon: Bell,
    title: "African Union Passport Initiative",
    date: "September 2024",
    summary: "Ghana continues to support the African Union's free movement protocol, enabling easier travel for AU citizens.",
    urgent: false,
  },
];

export function NewsSection() {
  return (
    <section id="news" className="section-padding bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Stay Informed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              News & Announcements
            </h2>
          </div>
          <Button variant="outline" className="self-start sm:self-auto">
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured News */}
          <div className="lg:row-span-2">
            <div className="h-full bg-primary rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-ghana-red text-white text-xs font-bold uppercase">
                  Important Alert
                </span>
              </div>
              <AlertTriangle className="w-12 h-12 text-secondary mb-6" />
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                {newsItems[0].title}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed mb-6 flex-grow">
                {newsItems[0].summary}
                <br /><br />
                Always verify information through official GIS channels. Report suspicious activities 
                to the nearest immigration office or contact our official hotlines.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                  <Calendar className="w-4 h-4" />
                  {newsItems[0].date}
                </div>
                <Button variant="hero" size="sm">
                  Read More
                </Button>
              </div>
            </div>
          </div>

          {/* Other News Items */}
          {newsItems.slice(1).map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium text-muted-foreground capitalize">
                      {item.type}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
