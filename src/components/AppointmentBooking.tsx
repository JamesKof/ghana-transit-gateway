import { useState } from "react";
import { Calendar, Clock, MapPin, User, Mail, Phone, FileText, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

const offices = [
  { id: "hq", name: "GIS Headquarters, Accra", address: "Independence Avenue, Accra" },
  { id: "kotoka", name: "Kotoka International Airport", address: "Airport, Accra" },
  { id: "tema", name: "Tema Regional Office", address: "Tema Community 1" },
  { id: "kumasi", name: "Kumasi Regional Office", address: "Adum, Kumasi" },
  { id: "takoradi", name: "Takoradi Regional Office", address: "Takoradi Market Circle" },
  { id: "tamale", name: "Tamale Regional Office", address: "Tamale Central" },
  { id: "aflao", name: "Aflao Border Post", address: "Aflao Border" },
  { id: "elubo", name: "Elubo Border Post", address: "Elubo Border" },
];

const services = [
  { id: "passport", name: "Passport Application" },
  { id: "visa", name: "Visa Application" },
  { id: "workpermit", name: "Work Permit" },
  { id: "residence", name: "Residence Permit" },
  { id: "indefinite", name: "Indefinite Residence" },
  { id: "citizenship", name: "Citizenship Application" },
  { id: "inquiry", name: "General Inquiry" },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
];

interface BookingDetails {
  office: string;
  service: string;
  date: Date | undefined;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  referenceNumber: string;
}

export function AppointmentBooking() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [booking, setBooking] = useState<BookingDetails>({
    office: "",
    service: "",
    date: undefined,
    time: "",
    fullName: "",
    email: "",
    phone: "",
    referenceNumber: "",
  });

  const generateReferenceNumber = () => {
    const prefix = "GIS";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refNumber = generateReferenceNumber();
    setBooking({ ...booking, referenceNumber: refNumber });
    setIsBooked(true);
  };

  const downloadConfirmation = () => {
    const selectedOffice = offices.find(o => o.id === booking.office);
    const selectedService = services.find(s => s.id === booking.service);
    
    const content = `
GHANA IMMIGRATION SERVICE
APPOINTMENT CONFIRMATION
================================

Reference Number: ${booking.referenceNumber}

APPOINTMENT DETAILS
-------------------
Office: ${selectedOffice?.name}
Address: ${selectedOffice?.address}
Service: ${selectedService?.name}
Date: ${booking.date ? format(booking.date, "EEEE, MMMM d, yyyy") : ""}
Time: ${booking.time}

APPLICANT INFORMATION
--------------------
Name: ${booking.fullName}
Email: ${booking.email}
Phone: ${booking.phone}

IMPORTANT INSTRUCTIONS
---------------------
1. Please arrive 15 minutes before your scheduled time
2. Bring this confirmation (printed or digital)
3. Bring valid identification (Passport, Ghana Card, or Voter ID)
4. Bring all required documents for your service type
5. Face masks are recommended

For inquiries, contact:
Phone: +233 302 224445
Email: info@gis.gov.gh
Website: https://gis.gov.gh

================================
Ghana Immigration Service
"Regulating Migration, Facilitating Mobility"
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GIS_Appointment_${booking.referenceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isBooked) {
    const selectedOffice = offices.find(o => o.id === booking.office);
    const selectedService = services.find(s => s.id === booking.service);

    return (
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
            {t("appointment.success")}
          </h3>
          <p className="text-muted-foreground">
            Your reference number is: <span className="font-bold text-primary">{booking.referenceNumber}</span>
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{selectedOffice?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedOffice?.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <p>{selectedService?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <p>{booking.date ? format(booking.date, "EEEE, MMMM d, yyyy") : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <p>{booking.time}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={downloadConfirmation} className="flex-1" variant="hero">
            <Download className="w-4 h-4 mr-2" />
            {t("appointment.downloadConfirmation")}
          </Button>
          <Button
            onClick={() => {
              setIsBooked(false);
              setStep(1);
              setBooking({
                office: "",
                service: "",
                date: undefined,
                time: "",
                fullName: "",
                email: "",
                phone: "",
                referenceNumber: "",
              });
            }}
            variant="outline"
            className="flex-1"
          >
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-md border border-border min-h-[500px] flex flex-col">
      <div className="text-center mb-8 flex-shrink-0">
        <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
          {t("appointment.title")}
        </h3>
        <p className="text-muted-foreground">{t("appointment.subtitle")}</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 mx-1 rounded ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Office & Service */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t("common.selectOffice")}
              </Label>
              <Select
                value={booking.office}
                onValueChange={(value) => setBooking({ ...booking, office: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a GIS office" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      <div>
                        <p className="font-medium">{office.name}</p>
                        <p className="text-xs text-muted-foreground">{office.address}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {t("common.serviceType")}
              </Label>
              <Select
                value={booking.service}
                onValueChange={(value) => setBooking({ ...booking, service: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!booking.office || !booking.service}
              className="w-full"
              variant="hero"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {t("common.selectDate")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {booking.date ? format(booking.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={booking.date}
                    onSelect={(date) => setBooking({ ...booking, date })}
                    disabled={(date) => 
                      date < new Date() || 
                      date.getDay() === 0 || 
                      date.getDay() === 6
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {t("common.selectTime")}
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setBooking({ ...booking, time: slot })}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      booking.time === slot
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!booking.date || !booking.time}
                className="flex-1"
                variant="hero"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {t("common.fullName")}
              </Label>
              <Input
                value={booking.fullName}
                onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {t("common.email")}
              </Label>
              <Input
                type="email"
                value={booking.email}
                onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {t("common.phone")}
              </Label>
              <Input
                type="tel"
                value={booking.phone}
                onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                placeholder="+233 XXX XXX XXXX"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!booking.fullName || !booking.email || !booking.phone}
                className="flex-1"
                variant="hero"
              >
                {t("common.bookAppointment")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
