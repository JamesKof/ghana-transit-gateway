-- Create table for e-visa applications
CREATE TABLE IF NOT EXISTS public.evisa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  nationality TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  travel_date DATE NOT NULL,
  visa_type TEXT NOT NULL,
  purpose_of_visit TEXT NOT NULL,
  visa_fee_amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  payment_verified_at TIMESTAMP WITH TIME ZONE,
  application_status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.evisa_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert new applications
CREATE POLICY "Anyone can submit e-visa applications"
  ON public.evisa_applications
  FOR INSERT
  WITH CHECK (true);

-- Anyone can view their own applications by reference number
CREATE POLICY "Users can view their own e-visa applications"
  ON public.evisa_applications
  FOR SELECT
  USING (true);

-- Admins can view all applications
CREATE POLICY "Admins can view all e-visa applications"
  ON public.evisa_applications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update applications
CREATE POLICY "Admins can update e-visa applications"
  ON public.evisa_applications
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_evisa_applications_updated_at
  BEFORE UPDATE ON public.evisa_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_evisa_reference_number ON public.evisa_applications(reference_number);
CREATE INDEX idx_evisa_payment_reference ON public.evisa_applications(payment_reference);
CREATE INDEX idx_evisa_email ON public.evisa_applications(email);
CREATE INDEX idx_evisa_submitted_at ON public.evisa_applications(submitted_at DESC);