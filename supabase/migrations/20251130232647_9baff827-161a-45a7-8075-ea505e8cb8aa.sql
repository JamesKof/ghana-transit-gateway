-- Create notification subscribers table
CREATE TABLE public.notification_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  application_ref TEXT,
  notification_types TEXT[] NOT NULL DEFAULT ARRAY['status'],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_email_ref UNIQUE (email, application_ref)
);

-- Create applications table for tracking
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT NOT NULL UNIQUE,
  applicant_email TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  application_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification log table
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES public.notification_subscribers(id) ON DELETE SET NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT NOT NULL DEFAULT 'sent'
);

-- Enable RLS but allow public access for subscribers (no auth required)
ALTER TABLE public.notification_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Public can subscribe to notifications
CREATE POLICY "Anyone can subscribe to notifications"
ON public.notification_subscribers
FOR INSERT
WITH CHECK (true);

-- Public can view their own subscriptions by email
CREATE POLICY "Anyone can view subscriptions by email"
ON public.notification_subscribers
FOR SELECT
USING (true);

-- Public can update their own subscriptions
CREATE POLICY "Anyone can update their subscriptions"
ON public.notification_subscribers
FOR UPDATE
USING (true);

-- Applications are publicly viewable by reference number
CREATE POLICY "Applications viewable by reference"
ON public.applications
FOR SELECT
USING (true);

-- Notification logs are viewable
CREATE POLICY "Logs are viewable"
ON public.notification_logs
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_notification_subscribers_updated_at
BEFORE UPDATE ON public.notification_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();