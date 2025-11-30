import { CheckCircle2, ArrowRight, FileText, Users, Briefcase, Home, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const permitTypes = [
  {
    icon: Briefcase,
    title: "Work Permit",
    description: "For foreign nationals seeking employment in Ghana",
    requirements: [
      "Valid passport (6+ months validity)",
      "Job offer from Ghanaian employer",
      "Company registration documents",
      "Professional qualifications",
      "Medical certificate",
    ],
    duration: "1-2 years",
    fee: "Varies by category",
  },
  {
    icon: Home,
    title: "Residence Permit",
    description: "For long-term stay and settlement in Ghana",
    requirements: [
      "Valid passport (6+ months validity)",
      "Proof of accommodation",
      "Financial sufficiency evidence",
      "Police clearance certificate",
      "Health insurance coverage",
    ],
    duration: "1-5 years",
    fee: "Based on duration",
  },
  {
    icon: GraduationCap,
    title: "Student Permit",
    description: "For foreign students enrolled in Ghanaian institutions",
    requirements: [
      "Valid passport",
      "Admission letter from institution",
      "Proof of tuition payment",
      "Sponsor's financial documents",
      "Medical certificate",
    ],
    duration: "Duration of study",
    fee: "Annual renewal",
  },
  {
    icon: Users,
    title: "Dependent Permit",
    description: "For family members of permit holders",
    requirements: [
      "Valid passport",
      "Principal permit holder's documents",
      "Proof of relationship",
      "Birth/Marriage certificates",
      "Medical certificate",
    ],
    duration: "Tied to principal",
    fee: "Per dependent",
  },
];

export function PermitsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Permits & Visas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Permit Categories
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Understand the different types of permits available and their requirements for 
            legal stay and work authorization in Ghana.
          </p>
        </div>

        {/* Permit Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {permitTypes.map((permit, index) => (
            <div
              key={index}
              className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary to-green-light p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
                    <permit.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-primary-foreground">
                      {permit.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/70">{permit.description}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  Requirements
                </h4>
                <ul className="space-y-2 mb-6">
                  {permit.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{permit.duration}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-muted-foreground">Processing Fee</p>
                    <p className="font-semibold text-secondary">{permit.fee}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                  <a href="https://gis.gov.gh/permits/" target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-grow">
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                Important Notice
              </h3>
              <p className="text-muted-foreground">
                All permit applications must be submitted through official GIS channels. Processing times 
                may vary based on application volume and completeness of documentation. Ensure all documents 
                are certified and translated to English where applicable.
              </p>
            </div>
            <Button variant="gold" size="lg" className="flex-shrink-0" asChild>
              <a href="https://gis.gov.gh/fees-and-charges/" target="_blank" rel="noopener noreferrer">
                View Fee Schedule
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
