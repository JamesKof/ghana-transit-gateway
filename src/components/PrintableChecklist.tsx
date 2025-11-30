import { useState } from "react";
import { FileText, Download, Printer, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ChecklistItem {
  id: string;
  item: string;
  description: string;
  required: boolean;
}

interface VisaChecklist {
  type: string;
  title: string;
  processingTime: string;
  fee: string;
  items: ChecklistItem[];
}

const checklists: Record<string, VisaChecklist> = {
  "tourist-single": {
    type: "tourist-single",
    title: "Tourist Visa (Single Entry)",
    processingTime: "5-10 business days",
    fee: "$60 USD",
    items: [
      { id: "1", item: "Valid Passport", description: "Must have at least 6 months validity from date of entry", required: true },
      { id: "2", item: "Completed Application Form", description: "Form GIS-V1 downloaded from gis.gov.gh or obtained at embassy", required: true },
      { id: "3", item: "Passport Photographs", description: "2 recent passport-size photos (35mm x 45mm) with white background", required: true },
      { id: "4", item: "Proof of Accommodation", description: "Hotel booking, invitation letter, or proof of residence in Ghana", required: true },
      { id: "5", item: "Return Flight Ticket", description: "Confirmed return or onward journey ticket", required: true },
      { id: "6", item: "Proof of Funds", description: "Bank statement showing minimum $50/day of stay", required: true },
      { id: "7", item: "Travel Itinerary", description: "Detailed travel plans including dates and locations", required: false },
      { id: "8", item: "Travel Insurance", description: "Comprehensive travel insurance covering medical emergencies", required: false },
      { id: "9", item: "Yellow Fever Certificate", description: "Valid yellow fever vaccination certificate", required: true },
      { id: "10", item: "Visa Fee Payment", description: "Proof of visa fee payment ($60 USD)", required: true },
    ],
  },
  "tourist-multiple": {
    type: "tourist-multiple",
    title: "Tourist Visa (Multiple Entry)",
    processingTime: "5-10 business days",
    fee: "$100 USD",
    items: [
      { id: "1", item: "Valid Passport", description: "Must have at least 6 months validity from date of entry", required: true },
      { id: "2", item: "Completed Application Form", description: "Form GIS-V1M downloaded from gis.gov.gh", required: true },
      { id: "3", item: "Passport Photographs", description: "2 recent passport-size photos (35mm x 45mm) with white background", required: true },
      { id: "4", item: "Proof of Accommodation", description: "Hotel booking or invitation letter for all planned visits", required: true },
      { id: "5", item: "Return Flight Ticket", description: "Confirmed return or onward journey ticket", required: true },
      { id: "6", item: "Proof of Funds", description: "Bank statement showing sufficient funds for multiple trips", required: true },
      { id: "7", item: "Justification Letter", description: "Letter explaining need for multiple entries", required: true },
      { id: "8", item: "Previous Travel History", description: "Copies of previous visas to Ghana (if applicable)", required: false },
      { id: "9", item: "Yellow Fever Certificate", description: "Valid yellow fever vaccination certificate", required: true },
      { id: "10", item: "Visa Fee Payment", description: "Proof of visa fee payment ($100 USD)", required: true },
    ],
  },
  "business": {
    type: "business",
    title: "Business Visa",
    processingTime: "5-10 business days",
    fee: "$80-150 USD",
    items: [
      { id: "1", item: "Valid Passport", description: "Must have at least 6 months validity from date of entry", required: true },
      { id: "2", item: "Completed Application Form", description: "Form GIS-BV1 for business visas", required: true },
      { id: "3", item: "Passport Photographs", description: "2 recent passport-size photos (35mm x 45mm) with white background", required: true },
      { id: "4", item: "Invitation Letter from Ghana", description: "Official invitation from Ghanaian business/organization", required: true },
      { id: "5", item: "Company Introduction Letter", description: "Letter from your employer stating purpose of visit", required: true },
      { id: "6", item: "Business Registration Documents", description: "Your company's registration certificate", required: true },
      { id: "7", item: "Host Company Documents", description: "Registration documents of the inviting Ghanaian company", required: true },
      { id: "8", item: "Bank Statements", description: "3 months of personal/company bank statements", required: true },
      { id: "9", item: "Flight Itinerary", description: "Confirmed flight booking", required: true },
      { id: "10", item: "Yellow Fever Certificate", description: "Valid yellow fever vaccination certificate", required: true },
      { id: "11", item: "Visa Fee Payment", description: "Proof of visa fee payment ($80-150 USD)", required: true },
    ],
  },
  "work-permit": {
    type: "work-permit",
    title: "Work Permit",
    processingTime: "4-8 weeks",
    fee: "$500-2,000 USD",
    items: [
      { id: "1", item: "Valid Passport", description: "Original passport with at least 12 months validity", required: true },
      { id: "2", item: "Work Permit Application Form", description: "Form GIS-WP1 completed and signed", required: true },
      { id: "3", item: "Passport Photographs", description: "4 recent passport-size photos (35mm x 45mm)", required: true },
      { id: "4", item: "Employment Contract", description: "Signed employment contract with Ghanaian employer", required: true },
      { id: "5", item: "Company Registration", description: "Employer's Certificate of Incorporation", required: true },
      { id: "6", item: "Tax Clearance Certificate", description: "Employer's valid tax clearance from GRA", required: true },
      { id: "7", item: "Educational Certificates", description: "Certified copies of degrees, diplomas, certifications", required: true },
      { id: "8", item: "Professional Qualifications", description: "Proof of professional licenses/certifications", required: true },
      { id: "9", item: "CV/Resume", description: "Detailed curriculum vitae", required: true },
      { id: "10", item: "Police Clearance Certificate", description: "From your country of residence (not older than 6 months)", required: true },
      { id: "11", item: "Medical Certificate", description: "Health certificate from approved medical facility", required: true },
      { id: "12", item: "Quota Approval", description: "Immigration quota approval for the position", required: true },
      { id: "13", item: "Yellow Fever Certificate", description: "Valid yellow fever vaccination certificate", required: true },
      { id: "14", item: "Work Permit Fee", description: "Proof of fee payment ($500-2,000 based on duration)", required: true },
    ],
  },
  "student": {
    type: "student",
    title: "Student Visa",
    processingTime: "2-4 weeks",
    fee: "$100-150 USD",
    items: [
      { id: "1", item: "Valid Passport", description: "Must have validity for duration of study plus 6 months", required: true },
      { id: "2", item: "Student Visa Application Form", description: "Form GIS-SV1 completed and signed", required: true },
      { id: "3", item: "Passport Photographs", description: "2 recent passport-size photos (35mm x 45mm)", required: true },
      { id: "4", item: "Admission Letter", description: "Official admission letter from recognized Ghanaian institution", required: true },
      { id: "5", item: "Academic Transcripts", description: "Certified copies of previous academic records", required: true },
      { id: "6", item: "Proof of Financial Support", description: "Bank statements, scholarship letter, or sponsor's declaration", required: true },
      { id: "7", item: "Sponsor's ID & Documents", description: "If sponsored: sponsor's passport/ID and proof of income", required: false },
      { id: "8", item: "Medical Certificate", description: "Health certificate from approved medical facility", required: true },
      { id: "9", item: "Police Clearance Certificate", description: "From your country of residence", required: true },
      { id: "10", item: "Yellow Fever Certificate", description: "Valid yellow fever vaccination certificate", required: true },
      { id: "11", item: "Visa Fee Payment", description: "Proof of visa fee payment ($100-150 USD)", required: true },
    ],
  },
  "residence": {
    type: "residence",
    title: "Residence Permit",
    processingTime: "4-6 weeks",
    fee: "$200-500 USD",
    items: [
      { id: "1", item: "Valid Passport", description: "Original passport with at least 12 months validity", required: true },
      { id: "2", item: "Residence Permit Application Form", description: "Form GIS-RP1 completed and signed", required: true },
      { id: "3", item: "Passport Photographs", description: "4 recent passport-size photos (35mm x 45mm)", required: true },
      { id: "4", item: "Proof of Legal Entry", description: "Valid visa or entry stamp in passport", required: true },
      { id: "5", item: "Proof of Accommodation", description: "Tenancy agreement or property ownership documents", required: true },
      { id: "6", item: "Proof of Income/Employment", description: "Employment letter, business registration, or pension documents", required: true },
      { id: "7", item: "Bank Statements", description: "6 months of bank statements showing financial stability", required: true },
      { id: "8", item: "Police Clearance Certificate", description: "From your country of origin (not older than 6 months)", required: true },
      { id: "9", item: "Medical Certificate", description: "Health certificate from approved medical facility in Ghana", required: true },
      { id: "10", item: "Tax Clearance (if applicable)", description: "GRA tax clearance for employed/business persons", required: false },
      { id: "11", item: "Yellow Fever Certificate", description: "Valid yellow fever vaccination certificate", required: true },
      { id: "12", item: "Residence Permit Fee", description: "Proof of fee payment ($200-500 USD)", required: true },
    ],
  },
};

export function PrintableChecklist() {
  const [selectedVisa, setSelectedVisa] = useState<string>("");

  const checklist = selectedVisa ? checklists[selectedVisa] : null;

  const generatePDF = () => {
    if (!checklist) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${checklist.title} - Document Checklist</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #006B3F;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #006B3F;
            margin: 0;
            font-size: 24px;
          }
          .header h2 {
            color: #333;
            margin: 10px 0;
            font-size: 18px;
          }
          .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: #006B3F;
            margin-bottom: 10px;
          }
          .info-box {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
          }
          .info-item {
            text-align: center;
          }
          .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
          }
          .info-value {
            font-size: 16px;
            font-weight: bold;
            color: #006B3F;
          }
          .checklist-item {
            display: flex;
            align-items: flex-start;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #006B3F;
            border-radius: 4px;
            margin-right: 15px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .item-content {
            flex: 1;
          }
          .item-title {
            font-weight: 600;
            color: #333;
          }
          .item-title .required {
            color: #dc2626;
            margin-left: 5px;
          }
          .item-description {
            font-size: 13px;
            color: #666;
            margin-top: 4px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #006B3F;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .notes {
            background: #fffbeb;
            padding: 15px;
            border-radius: 8px;
            margin-top: 30px;
            border-left: 4px solid #f59e0b;
          }
          .notes h3 {
            margin-top: 0;
            color: #b45309;
          }
          .notes ul {
            margin: 0;
            padding-left: 20px;
          }
          .notes li {
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-text">GHANA IMMIGRATION SERVICE</div>
          <h1>Document Checklist</h1>
          <h2>${checklist.title}</h2>
        </div>
        
        <div class="info-box">
          <div class="info-item">
            <div class="info-label">Processing Time</div>
            <div class="info-value">${checklist.processingTime}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Application Fee</div>
            <div class="info-value">${checklist.fee}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date Generated</div>
            <div class="info-value">${new Date().toLocaleDateString("en-GB")}</div>
          </div>
        </div>

        <p><strong>Applicant Name:</strong> ______________________________ <strong>Date:</strong> ______________</p>

        ${checklist.items.map(item => `
          <div class="checklist-item">
            <div class="checkbox"></div>
            <div class="item-content">
              <div class="item-title">
                ${item.item}
                ${item.required ? '<span class="required">*</span>' : ''}
              </div>
              <div class="item-description">${item.description}</div>
            </div>
          </div>
        `).join("")}

        <div class="notes">
          <h3>Important Notes</h3>
          <ul>
            <li>Items marked with * are mandatory requirements</li>
            <li>All documents must be original or certified true copies</li>
            <li>Documents not in English must have certified translations</li>
            <li>Fees are subject to change - verify current fees at gis.gov.gh</li>
            <li>Processing times are estimates and may vary</li>
          </ul>
        </div>

        <div class="footer">
          <p><strong>Ghana Immigration Service</strong></p>
          <p>Independence Avenue, Accra | Tel: +233 302 224 445</p>
          <p>Website: www.gis.gov.gh | Email: info@gis.gov.gh</p>
          <p style="margin-top: 15px; font-style: italic;">This checklist is for guidance only. Please verify all requirements with GIS before submission.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <CheckSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-foreground">Document Checklist</h3>
          <p className="text-sm text-muted-foreground">Download a printable checklist for your application</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label>Select Visa/Permit Type</Label>
          <Select value={selectedVisa} onValueChange={setSelectedVisa}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choose your application type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tourist-single">Tourist Visa (Single Entry)</SelectItem>
              <SelectItem value="tourist-multiple">Tourist Visa (Multiple Entry)</SelectItem>
              <SelectItem value="business">Business Visa</SelectItem>
              <SelectItem value="work-permit">Work Permit</SelectItem>
              <SelectItem value="student">Student Visa</SelectItem>
              <SelectItem value="residence">Residence Permit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {checklist && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Processing Time</p>
                <p className="font-semibold text-foreground">{checklist.processingTime}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Application Fee</p>
                <p className="font-semibold text-primary">{checklist.fee}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Required Documents ({checklist.items.filter(i => i.required).length} mandatory)
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {checklist.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 ${item.required ? "border-primary" : "border-muted-foreground/30"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.item}
                        {item.required && <span className="text-destructive ml-1">*</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={generatePDF} className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print Checklist
              </Button>
              <Button variant="outline" onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />
                Save as PDF
              </Button>
            </div>
          </div>
        )}

        {!selectedVisa && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Select a visa type to view the document checklist</p>
          </div>
        )}
      </div>
    </div>
  );
}
