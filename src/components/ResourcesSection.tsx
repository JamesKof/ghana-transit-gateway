import { FileText, Download, Book, Scale, FileSpreadsheet, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: Book,
    title: "Legal Handbook",
    description: "Comprehensive guide to immigration laws, regulations, and procedures in Ghana.",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    icon: Scale,
    title: "Immigration Act 2000 (Act 573)",
    description: "The principal legislation governing immigration in Ghana.",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    icon: FileText,
    title: "Visa Application Forms",
    description: "Downloadable forms for various visa and permit applications.",
    type: "Forms",
    size: "Multiple",
  },
  {
    icon: FileSpreadsheet,
    title: "Fee Schedule 2024",
    description: "Current fees for all immigration services and permits.",
    type: "PDF",
    size: "520 KB",
  },
  {
    icon: Book,
    title: "Strategic Plan 2021-2025",
    description: "GIS strategic objectives and development framework.",
    type: "PDF",
    size: "3.1 MB",
  },
  {
    icon: HelpCircle,
    title: "FAQs & Guidelines",
    description: "Frequently asked questions and step-by-step application guides.",
    type: "Guide",
    size: "1.2 MB",
  },
];

const faqs = [
  {
    question: "How long does visa processing take?",
    answer: "Standard visa processing takes 5-10 working days. Express services are available for urgent applications.",
  },
  {
    question: "What documents are required for a work permit?",
    answer: "Requirements include a valid passport, job offer letter, company registration documents, and proof of qualifications.",
  },
  {
    question: "Can I extend my visa while in Ghana?",
    answer: "Yes, visa extensions can be processed at any GIS regional office before your current visa expires.",
  },
  {
    question: "How do I check my application status?",
    answer: "Application status can be checked online through the GIS portal or by visiting the office where you submitted.",
  },
];

export function ResourcesSection() {
  return (
    <section id="faq" className="section-padding bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            Resources
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Documents & FAQs
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Access official documents, application forms, and find answers to commonly asked questions.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <resource.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {resource.type}
                </span>
              </div>
              <h4 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {resource.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{resource.size}</span>
                <Button variant="ghost" size="sm" className="group-hover:text-primary">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border shadow-sm"
              >
                <h4 className="font-semibold text-foreground mb-2 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-sm flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  {faq.question}
                </h4>
                <p className="text-muted-foreground pl-9">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
