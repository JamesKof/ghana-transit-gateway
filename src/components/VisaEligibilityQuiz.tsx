import { useState } from "react";
import { CheckCircle, ArrowRight, ArrowLeft, RotateCcw, FileText, Briefcase, GraduationCap, Users, Plane, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  question: string;
  options: { id: string; label: string; icon?: React.ElementType }[];
}

interface VisaResult {
  type: string;
  description: string;
  requirements: string[];
  processingTime: string;
  fee: string;
  link: string;
}

const questions: Question[] = [
  {
    id: "purpose",
    question: "What is the primary purpose of your visit to Ghana?",
    options: [
      { id: "tourism", label: "Tourism / Holiday", icon: Plane },
      { id: "business", label: "Business / Meetings", icon: Briefcase },
      { id: "work", label: "Employment / Work", icon: Building },
      { id: "study", label: "Education / Study", icon: GraduationCap },
      { id: "family", label: "Family Visit / Reunion", icon: Users },
      { id: "transit", label: "Transit / Layover", icon: Plane },
    ],
  },
  {
    id: "duration",
    question: "How long do you plan to stay in Ghana?",
    options: [
      { id: "under48h", label: "Less than 48 hours" },
      { id: "under30", label: "Less than 30 days" },
      { id: "30to90", label: "30 - 90 days" },
      { id: "90to180", label: "3 - 6 months" },
      { id: "over180", label: "More than 6 months" },
      { id: "permanent", label: "Permanent / Indefinite" },
    ],
  },
  {
    id: "nationality",
    question: "Which region is your nationality from?",
    options: [
      { id: "ecowas", label: "ECOWAS Member Country" },
      { id: "au", label: "Other African Union Country" },
      { id: "eu", label: "European Union" },
      { id: "americas", label: "North / South America" },
      { id: "asia", label: "Asia / Pacific" },
      { id: "other", label: "Other Region" },
    ],
  },
  {
    id: "visits",
    question: "How many times do you plan to enter Ghana?",
    options: [
      { id: "single", label: "Single Entry (One visit)" },
      { id: "multiple", label: "Multiple Entries (Several visits)" },
    ],
  },
];

const determineVisa = (answers: Record<string, string>): VisaResult => {
  const { purpose, duration, nationality, visits } = answers;

  // ECOWAS nationals - visa free
  if (nationality === "ecowas") {
    if (duration === "permanent" || duration === "over180") {
      return {
        type: "ECOWAS Residence Permit",
        description: "As an ECOWAS national, you enjoy visa-free entry but need a residence permit for stays over 90 days.",
        requirements: ["Valid ECOWAS passport or travel certificate", "Proof of accommodation", "Proof of income/employment", "Medical certificate"],
        processingTime: "2-4 weeks",
        fee: "$200 - $300",
        link: "/permits",
      };
    }
    return {
      type: "Visa-Free Entry (ECOWAS)",
      description: "ECOWAS nationals enjoy visa-free entry to Ghana for up to 90 days. No visa application required!",
      requirements: ["Valid ECOWAS passport or travel certificate", "Return ticket (recommended)", "Proof of accommodation"],
      processingTime: "No processing needed",
      fee: "Free",
      link: "/services",
    };
  }

  // Transit visa
  if (purpose === "transit" || duration === "under48h") {
    return {
      type: "Transit Visa",
      description: "For travelers passing through Ghana to another destination with a layover exceeding airport transit.",
      requirements: ["Valid passport (6+ months)", "Onward ticket", "Visa for final destination (if required)", "Transit visa application form"],
      processingTime: "3-5 business days",
      fee: "$30",
      link: "/services",
    };
  }

  // Work purposes
  if (purpose === "work") {
    return {
      type: "Work Permit & Residence Permit",
      description: "Required for foreign nationals seeking employment in Ghana. Your employer must initiate the application.",
      requirements: ["Valid passport (6+ months)", "Employment contract", "Company registration documents", "Educational certificates", "Police clearance", "Medical certificate", "Passport photos"],
      processingTime: "4-8 weeks",
      fee: "$500 - $2,000 (based on duration)",
      link: "/permits",
    };
  }

  // Study purposes
  if (purpose === "study") {
    return {
      type: "Student Visa",
      description: "For international students enrolled in recognized Ghanaian educational institutions.",
      requirements: ["Valid passport (6+ months)", "Admission letter from institution", "Proof of financial support", "Medical certificate", "Police clearance", "Passport photos"],
      processingTime: "2-4 weeks",
      fee: "$100 - $150",
      link: "/services",
    };
  }

  // Business purposes
  if (purpose === "business") {
    if (duration === "over180" || duration === "permanent") {
      return {
        type: "Business Residence Permit",
        description: "For business owners and investors planning extended business activities in Ghana.",
        requirements: ["Valid passport (6+ months)", "Business plan", "Company registration (or GIPC registration)", "Bank statements", "Proof of investment", "Medical certificate"],
        processingTime: "4-6 weeks",
        fee: "$300 - $500",
        link: "/permits",
      };
    }
    return {
      type: visits === "multiple" ? "Business Visa (Multiple Entry)" : "Business Visa (Single Entry)",
      description: "For attending meetings, conferences, or conducting business negotiations in Ghana.",
      requirements: ["Valid passport (6+ months)", "Invitation from Ghanaian company", "Business registration documents", "Bank statements", "Travel itinerary", "Passport photos"],
      processingTime: "5-10 business days",
      fee: visits === "multiple" ? "$150" : "$80",
      link: "/services",
    };
  }

  // Family visit
  if (purpose === "family") {
    if (duration === "over180" || duration === "permanent") {
      return {
        type: "Dependent Residence Permit",
        description: "For family members of Ghana residents or citizens seeking to live in Ghana long-term.",
        requirements: ["Valid passport (6+ months)", "Proof of relationship", "Sponsor's residence documents", "Financial support evidence", "Medical certificate"],
        processingTime: "4-6 weeks",
        fee: "$200 - $400",
        link: "/permits",
      };
    }
  }

  // Default tourist visa
  return {
    type: visits === "multiple" ? "Tourist Visa (Multiple Entry)" : "Tourist Visa (Single Entry)",
    description: "For leisure travel, sightseeing, visiting friends/family, or attending events in Ghana.",
    requirements: ["Valid passport (6+ months)", "Completed application form", "2 passport photos", "Proof of accommodation", "Return flight ticket", "Proof of sufficient funds ($50/day minimum)", "Travel insurance (recommended)"],
    processingTime: "5-10 business days",
    fee: visits === "multiple" ? "$100" : "$60",
    link: "/services",
  };
};

export function VisaEligibilityQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<VisaResult | null>(null);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleAnswer = (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setResult(determineVisa(newAnswers));
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-foreground">Visa Eligibility Checker</h3>
          <p className="text-sm text-muted-foreground">Find the right visa for your needs</p>
        </div>
      </div>

      {/* Progress Bar */}
      {!result && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Question */}
      {!result && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-foreground">{currentQuestion.question}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentQuestion.options.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`p-4 text-left rounded-xl border transition-all hover:border-primary hover:bg-primary/5 ${
                    answers[currentQuestion.id] === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-primary shrink-0" />}
                    <span className="text-sm font-medium text-foreground">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {currentStep > 0 && (
            <Button variant="ghost" onClick={goBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Question
            </Button>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl">
            <CheckCircle className="w-8 h-8 text-primary shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Recommended Visa Type</p>
              <h4 className="text-xl font-bold text-primary">{result.type}</h4>
            </div>
          </div>

          <p className="text-muted-foreground">{result.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Processing Time</p>
              <p className="font-semibold text-foreground">{result.processingTime}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Estimated Fee</p>
              <p className="font-semibold text-primary">{result.fee}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Required Documents:</p>
            <ul className="space-y-1.5">
              {result.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button asChild className="flex-1">
              <Link to={result.link}>
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
