-- Create leadership_profiles table
CREATE TABLE public.leadership_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  role text NOT NULL,
  description text NOT NULL,
  full_bio text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  office text NOT NULL,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on leadership_profiles
ALTER TABLE public.leadership_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leadership_profiles
CREATE POLICY "Leadership profiles are viewable by everyone"
ON public.leadership_profiles
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert leadership profiles"
ON public.leadership_profiles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leadership profiles"
ON public.leadership_profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leadership profiles"
ON public.leadership_profiles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_leadership_profiles_updated_at
BEFORE UPDATE ON public.leadership_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial leadership data
INSERT INTO public.leadership_profiles (name, title, role, description, full_bio, phone, email, office, display_order) VALUES
('Comptroller-General of Immigration', 'Head of Service', 'Executive Head', 'The Comptroller-General is the administrative head of the Ghana Immigration Service, responsible for the overall management and strategic direction of the Service.', 'The Comptroller-General serves as the chief executive officer of the Ghana Immigration Service. With over 30 years of distinguished service, the CG provides strategic leadership and ensures the effective implementation of immigration policies. Responsibilities include overseeing all operational, administrative, and financial aspects of the Service, representing GIS at national and international forums, and advising government on immigration matters.', '+233 302 258 250', 'cg@gis.gov.gh', 'GIS Headquarters, Independence Avenue, Accra', 1),
('Deputy Comptroller-General (Operations)', 'DCG Operations', 'Operations', 'Oversees all operational activities including border management, enforcement, and investigation units across all entry points.', 'The Deputy Comptroller-General (Operations) is responsible for the day-to-day operational activities of the Service. This includes supervising border control operations at all ports of entry, coordinating enforcement activities, managing investigation units, and ensuring compliance with immigration laws. The DCG Operations works closely with regional commanders to maintain effective border security nationwide.', '+233 302 258 251', 'dcg.operations@gis.gov.gh', 'GIS Headquarters, Independence Avenue, Accra', 2),
('Deputy Comptroller-General (Finance & Admin)', 'DCG Finance & Administration', 'Finance & Admin', 'Manages financial operations, human resources, procurement, and administrative functions of the Service.', 'The Deputy Comptroller-General (Finance & Administration) oversees all financial and administrative operations of the Ghana Immigration Service. Key responsibilities include budget preparation and management, human resource development, procurement processes, and ensuring proper utilization of Service resources. The DCG Finance & Admin also coordinates training programs and welfare initiatives for all personnel.', '+233 302 258 252', 'dcg.finance@gis.gov.gh', 'GIS Headquarters, Independence Avenue, Accra', 3);