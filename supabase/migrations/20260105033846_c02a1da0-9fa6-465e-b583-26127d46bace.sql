-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Branding table
CREATE TABLE public.branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fest_name TEXT NOT NULL DEFAULT 'AADHRITA',
  college_name TEXT NOT NULL DEFAULT 'Maharaj Vijayaram Gajapathi Raj College of Engineering',
  location TEXT NOT NULL DEFAULT 'Vizianagaram, Andhra Pradesh',
  logo_url TEXT DEFAULT '/placeholder.svg',
  glow_color TEXT DEFAULT '#ff0040',
  hero_title TEXT DEFAULT 'AADHRITA 2026',
  hero_subtitle TEXT DEFAULT 'The Ultimate Tech & Cultural Fest',
  hero_date TEXT DEFAULT 'March 15-17, 2026',
  hero_venue TEXT DEFAULT 'MVGR College of Engineering',
  hero_logo TEXT DEFAULT '/placeholder.svg',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Technical',
  date TEXT,
  time TEXT,
  description TEXT,
  poster_url TEXT,
  logo_url TEXT,
  accent_color TEXT DEFAULT '#00f0ff',
  registration_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- FAQs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Supporter',
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team table
CREATE TABLE public.team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  photo_url TEXT,
  type TEXT NOT NULL DEFAULT 'student',
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About table
CREATE TABLE public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about TEXT,
  mission TEXT,
  vision TEXT,
  stat1 TEXT DEFAULT '5000+',
  stat2 TEXT DEFAULT '50+',
  stat3 TEXT DEFAULT '100+',
  stat4 TEXT DEFAULT '3',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for all tables
CREATE POLICY "Public read branding" ON public.branding FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public read sponsors" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Public read team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public read about" ON public.about FOR SELECT USING (true);

-- RLS Policies: Admin write access
CREATE POLICY "Admin insert branding" ON public.branding FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update branding" ON public.branding FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete branding" ON public.branding FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert events" ON public.events FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update events" ON public.events FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete events" ON public.events FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert faqs" ON public.faqs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update faqs" ON public.faqs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete faqs" ON public.faqs FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert gallery" ON public.gallery FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update gallery" ON public.gallery FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete gallery" ON public.gallery FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert sponsors" ON public.sponsors FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update sponsors" ON public.sponsors FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete sponsors" ON public.sponsors FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert team" ON public.team FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update team" ON public.team FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete team" ON public.team FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert announcements" ON public.announcements FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update announcements" ON public.announcements FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete announcements" ON public.announcements FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin insert about" ON public.about FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update about" ON public.about FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete about" ON public.about FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.branding;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sponsors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.about;

-- Insert default branding row
INSERT INTO public.branding (fest_name, college_name, location) VALUES ('AADHRITA', 'Maharaj Vijayaram Gajapathi Raj College of Engineering', 'Vizianagaram, Andhra Pradesh');

-- Insert default about row
INSERT INTO public.about (about, mission, vision) VALUES (
  'AADHRITA is the annual technical and cultural festival of MVGR College of Engineering.',
  'To provide a platform for students to showcase their talents and skills.',
  'To become the most celebrated college fest in Andhra Pradesh.'
);