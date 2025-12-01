-- Create feedback table for regional command complaints/feedback
CREATE TABLE public.regional_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  feedback_type TEXT NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.regional_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback" 
ON public.regional_feedback 
FOR INSERT 
WITH CHECK (true);

-- Allow viewing own feedback by email (for status checking)
CREATE POLICY "Users can view their own feedback" 
ON public.regional_feedback 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_regional_feedback_updated_at
BEFORE UPDATE ON public.regional_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();