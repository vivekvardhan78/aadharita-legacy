# AADHRITA 2026 - Database Setup Guide

This document contains the complete SQL schema to set up the database locally or in any Supabase project.

## Prerequisites

- Supabase CLI installed, OR
- Access to Supabase Dashboard SQL Editor, OR
- PostgreSQL database with Supabase extensions

---

## 1. Create Enum Types

```sql
-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
```

---

## 2. Create Tables

### 2.1 User Roles Table

```sql
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### 2.2 Branding Table

```sql
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
    fest_intro TEXT DEFAULT 'Welcome to the ultimate celebration of technology, innovation, and creativity',
    fest_theme TEXT DEFAULT 'Innovation Beyond Boundaries',
    fest_dates TEXT DEFAULT 'March 15-17, 2026',
    fest_highlights TEXT DEFAULT 'Technical Events, Cultural Shows, Workshops, Competitions',
    countdown_datetime TIMESTAMP WITH TIME ZONE DEFAULT '2026-03-15 09:00:00+05:30',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branding ENABLE ROW LEVEL SECURITY;
```

### 2.3 About Table

```sql
CREATE TABLE public.about (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    about TEXT,
    about_aadhrita TEXT DEFAULT 'AADHRITA is the flagship national-level technical fest that brings together the brightest minds from across the country.',
    about_mvgr TEXT DEFAULT 'Maharaj Vijayaram Gajapathi Raj College of Engineering is one of the premier engineering institutions in Andhra Pradesh.',
    vision TEXT,
    mission TEXT,
    stat1 TEXT DEFAULT '5000+',
    stat2 TEXT DEFAULT '50+',
    stat3 TEXT DEFAULT '100+',
    stat4 TEXT DEFAULT '3',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
```

### 2.4 Events Table

```sql
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Technical',
    description TEXT,
    date TEXT,
    time TEXT,
    poster_url TEXT,
    logo_url TEXT,
    accent_color TEXT DEFAULT '#00f0ff',
    enable_registration BOOLEAN DEFAULT true,
    registration_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
```

### 2.5 FAQs Table

```sql
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
```

### 2.6 Gallery Table

```sql
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    event_name TEXT,
    year TEXT DEFAULT '2026',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
```

### 2.7 Sponsors Table

```sql
CREATE TABLE public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    category TEXT NOT NULL DEFAULT 'Supporter',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
```

### 2.8 Team Table

```sql
CREATE TABLE public.team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    department TEXT,
    photo_url TEXT,
    phone TEXT,
    type TEXT NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
```

### 2.9 Announcements Table

```sql
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
```

---

## 3. Create Security Definer Function

This function is used to check user roles without triggering recursive RLS policies.

```sql
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
```

---

## 4. Create RLS Policies

### 4.1 User Roles Policies

```sql
-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admin can manage all roles
CREATE POLICY "Admin can manage roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.2 Branding Policies

```sql
CREATE POLICY "Public read branding"
ON public.branding FOR SELECT
USING (true);

CREATE POLICY "Admin insert branding"
ON public.branding FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update branding"
ON public.branding FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete branding"
ON public.branding FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.3 About Policies

```sql
CREATE POLICY "Public read about"
ON public.about FOR SELECT
USING (true);

CREATE POLICY "Admin insert about"
ON public.about FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update about"
ON public.about FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete about"
ON public.about FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.4 Events Policies

```sql
CREATE POLICY "Public read events"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Admin insert events"
ON public.events FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update events"
ON public.events FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete events"
ON public.events FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.5 FAQs Policies

```sql
CREATE POLICY "Public read faqs"
ON public.faqs FOR SELECT
USING (true);

CREATE POLICY "Admin insert faqs"
ON public.faqs FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update faqs"
ON public.faqs FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete faqs"
ON public.faqs FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.6 Gallery Policies

```sql
CREATE POLICY "Public read gallery"
ON public.gallery FOR SELECT
USING (true);

CREATE POLICY "Admin insert gallery"
ON public.gallery FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update gallery"
ON public.gallery FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete gallery"
ON public.gallery FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.7 Sponsors Policies

```sql
CREATE POLICY "Public read sponsors"
ON public.sponsors FOR SELECT
USING (true);

CREATE POLICY "Admin insert sponsors"
ON public.sponsors FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update sponsors"
ON public.sponsors FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete sponsors"
ON public.sponsors FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.8 Team Policies

```sql
CREATE POLICY "Public read team"
ON public.team FOR SELECT
USING (true);

CREATE POLICY "Admin insert team"
ON public.team FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update team"
ON public.team FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete team"
ON public.team FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 4.9 Announcements Policies

```sql
CREATE POLICY "Public read announcements"
ON public.announcements FOR SELECT
USING (true);

CREATE POLICY "Admin insert announcements"
ON public.announcements FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update announcements"
ON public.announcements FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete announcements"
ON public.announcements FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

---

## 5. Insert Default Data

### 5.1 Default Branding

```sql
INSERT INTO public.branding (
    fest_name,
    college_name,
    location,
    hero_title,
    hero_subtitle,
    hero_date,
    hero_venue,
    fest_intro,
    fest_theme,
    fest_dates,
    fest_highlights
) VALUES (
    'AADHRITA',
    'Maharaj Vijayaram Gajapathi Raj College of Engineering',
    'Vizianagaram, Andhra Pradesh',
    'AADHRITA 2026',
    'The Ultimate Tech & Cultural Fest',
    'March 15-17, 2026',
    'MVGR College of Engineering',
    'Welcome to the ultimate celebration of technology, innovation, and creativity',
    'Innovation Beyond Boundaries',
    'March 15-17, 2026',
    'Technical Events, Cultural Shows, Workshops, Competitions'
);
```

### 5.2 Default About

```sql
INSERT INTO public.about (
    about_aadhrita,
    about_mvgr,
    stat1,
    stat2,
    stat3,
    stat4
) VALUES (
    'AADHRITA is the flagship national-level technical fest that brings together the brightest minds from across the country.',
    'Maharaj Vijayaram Gajapathi Raj College of Engineering is one of the premier engineering institutions in Andhra Pradesh.',
    '5000+',
    '50+',
    '100+',
    '3'
);
```

---

## 6. Create First Admin User

After a user signs up, manually assign them the admin role:

```sql
-- Replace 'USER_UUID_HERE' with the actual user ID from auth.users
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin');
```

---

## 7. Quick Setup Script (All-in-One)

Copy and run this complete script to set up everything at once:

```sql
-- =============================================
-- AADHRITA 2026 DATABASE SETUP - COMPLETE SCRIPT
-- =============================================

-- 1. Create Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create Tables
-- (Copy all CREATE TABLE statements from sections 2.1 to 2.9)

-- 3. Create has_role function
-- (Copy from section 3)

-- 4. Create all RLS policies
-- (Copy all policies from sections 4.1 to 4.9)

-- 5. Insert default data
-- (Copy from sections 5.1 and 5.2)
```

---

## Environment Variables

For your application, set these environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

---

## Notes

- All tables have RLS enabled with public read access
- Only users with 'admin' role can create, update, or delete data
- The `has_role` function uses `SECURITY DEFINER` to prevent recursive RLS issues
- FAQs are linked to events via `event_id`
