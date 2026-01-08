import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Types matching our database schema
export interface Branding {
  id: string;
  fest_name: string;
  college_name: string;
  location: string;
  logo_url: string | null;
  glow_color: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_date: string | null;
  hero_venue: string | null;
  hero_logo: string | null;
  // New hero CMS fields
  fest_intro: string | null;
  fest_theme: string | null;
  fest_dates: string | null;
  fest_highlights: string | null;
  countdown_datetime: string | null;
}

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string | null;
  time: string | null;
  description: string | null;
  poster_url: string | null;
  logo_url: string | null;
  accent_color: string | null;
  registration_url: string | null;
  enable_registration: boolean;
}

export interface FAQ {
  id: string;
  event_id: string;
  question: string;
  answer: string;
  priority: number | null;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  year: string | null;
  event_name: string | null;
}

export interface Sponsor {
  id: string;
  name: string;
  category: string;
  logo_url: string | null;
  website: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  photo_url: string | null;
  type: string;
  department: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string | null;
  priority: number | null;
}

export interface About {
  id: string;
  about: string | null;
  mission: string | null;
  vision: string | null;
  stat1: string | null;
  stat2: string | null;
  stat3: string | null;
  stat4: string | null;
  about_aadhrita: string | null;
  about_mvgr: string | null;
}

// Branding hook
export function useBranding() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('branding')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setBranding(data);
      } catch (err) {
        console.error('Error fetching branding:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();

    channel = supabase
      .channel('branding-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'branding' },
        () => fetchBranding()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { branding, loading };
}

// Events hook with FAQs
export function useEvents() {
  const [events, setEvents] = useState<(Event & { faqs: FAQ[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let eventsChannel: RealtimeChannel;
    let faqsChannel: RealtimeChannel;

    const fetchEvents = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*');

        if (eventsError) throw eventsError;

        const { data: faqsData, error: faqsError } = await supabase
          .from('faqs')
          .select('*')
          .order('priority', { ascending: true });

        if (faqsError) throw faqsError;

        const eventsWithFaqs = (eventsData || []).map(event => ({
          ...event,
          faqs: (faqsData || []).filter(faq => faq.event_id === event.id)
        }));

        setEvents(eventsWithFaqs);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => fetchEvents()
      )
      .subscribe();

    faqsChannel = supabase
      .channel('faqs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'faqs' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(faqsChannel);
    };
  }, []);

  return { events, loading };
}

// Gallery hook
export function useGallery() {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchData = async () => {
      try {
        const { data: result, error } = await supabase
          .from('gallery')
          .select('*');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    channel = supabase
      .channel('gallery-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading };
}

// Sponsors hook
export function useSponsors() {
  const [data, setData] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchData = async () => {
      try {
        const { data: result, error } = await supabase
          .from('sponsors')
          .select('*');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    channel = supabase
      .channel('sponsors-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sponsors' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading };
}

// Team hook
export function useTeam() {
  const [data, setData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchData = async () => {
      try {
        const { data: result, error } = await supabase
          .from('team')
          .select('*');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    channel = supabase
      .channel('team-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading };
}

// Announcements hook
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('priority', { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => fetchAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { announcements, loading };
}

// About hook
export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setAbout(data);
      } catch (err) {
        console.error('Error fetching about:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();

    channel = supabase
      .channel('about-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'about' },
        () => fetchAbout()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { about, loading };
}
