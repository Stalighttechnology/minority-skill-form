CREATE TABLE public.vtu_minority_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  father_name TEXT,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  religion TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  taluk TEXT,
  pincode TEXT NOT NULL,
  qualification TEXT NOT NULL,
  year_of_passing TEXT,
  course TEXT NOT NULL,
  preferred_centre TEXT NOT NULL,
  employment_status TEXT,
  family_income TEXT,
  heard_from TEXT,
  remarks TEXT,
  declaration BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.vtu_minority_registrations TO anon;
GRANT INSERT, SELECT ON public.vtu_minority_registrations TO authenticated;
GRANT ALL ON public.vtu_minority_registrations TO service_role;
ALTER TABLE public.vtu_minority_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a registration" ON public.vtu_minority_registrations FOR INSERT TO anon, authenticated WITH CHECK (declaration = true);