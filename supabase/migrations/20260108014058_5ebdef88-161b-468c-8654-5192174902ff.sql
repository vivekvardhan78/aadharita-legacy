
-- Extend branding table with new hero CMS fields
ALTER TABLE public.branding
ADD COLUMN IF NOT EXISTS fest_intro TEXT DEFAULT 'Welcome to the ultimate celebration of technology, innovation, and creativity',
ADD COLUMN IF NOT EXISTS fest_theme TEXT DEFAULT 'Innovation Beyond Boundaries',
ADD COLUMN IF NOT EXISTS fest_dates TEXT DEFAULT 'March 15-17, 2026',
ADD COLUMN IF NOT EXISTS fest_highlights TEXT DEFAULT 'Technical Events, Cultural Shows, Workshops, Competitions',
ADD COLUMN IF NOT EXISTS countdown_datetime TIMESTAMP WITH TIME ZONE DEFAULT '2026-03-15 09:00:00+05:30';

-- Extend events table with registration toggle
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS enable_registration BOOLEAN DEFAULT true;

-- Extend gallery table with year and event name
ALTER TABLE public.gallery
ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '2026',
ADD COLUMN IF NOT EXISTS event_name TEXT;

-- Extend about table with dual about system
ALTER TABLE public.about
ADD COLUMN IF NOT EXISTS about_aadhrita TEXT DEFAULT 'AADHRITA is the flagship national-level technical fest that brings together the brightest minds from across the country.',
ADD COLUMN IF NOT EXISTS about_mvgr TEXT DEFAULT 'Maharaj Vijayaram Gajapathi Raj College of Engineering is one of the premier engineering institutions in Andhra Pradesh.';
