import { Target, Eye, Heart, Scale, Shield, BookOpen } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "Upholding the highest ethical standards in all our operations and interactions.",
  },
  {
    icon: Heart,
    title: "Professionalism",
    description: "Delivering excellent service with competence, courtesy, and dedication.",
  },
  {
    icon: Scale,
    title: "Fairness",
    description: "Treating all persons with equity, respect, and impartiality under the law.",
  },
  {
    icon: BookOpen,
    title: "Accountability",
    description: "Taking responsibility for our actions and decisions in service delivery.",
  },
];

const functions = [
  "Issuing travel documents to Ghanaian citizens",
  "Processing visas and residence permits for foreign nationals",
  "Managing border control and surveillance",
  "Combating irregular migration and human trafficking",
  "Implementing refugee protection policies",
  "Collaborating with international migration agencies",
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/50 to-transparent -z-10" />

      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            About Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Core Mandate
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Established by the Immigration Act, 2000 (Act 573) and the Immigration Service Law, 2016 (Act 908), 
            the Ghana Immigration Service is mandated to regulate migration and ensure national security 
            while facilitating legitimate travel.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8 card-hover group">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <Target className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To effectively regulate migration for national security and development through the provision 
              of quality, customer-focused services by leveraging technology and a motivated workforce 
              in accordance with national and international laws and standards.
            </p>
          </div>

          <div className="glass-card p-8 card-hover group">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <Eye className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be a world-class immigration service that excels in border management, migration regulation, 
              and the provision of quality services to all stakeholders while contributing significantly 
              to national security and development.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
            Our Core Values
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg text-foreground mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Functions */}
        <div className="bg-primary rounded-3xl p-8 md:p-12">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-8 text-center">
            Key Functions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {functions.map((func, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-secondary-foreground">{index + 1}</span>
                </div>
                <p className="text-primary-foreground/90 text-sm leading-relaxed">{func}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
