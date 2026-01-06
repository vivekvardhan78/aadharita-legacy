import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Image, Bell, Settings, LogOut, Plus, Trash2, Edit2, Save, X, Home, Info,
  Building2, Users, GraduationCap, Award, Palette, Sparkles, HelpCircle, ChevronUp, ChevronDown, Loader2
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { processImageUrl, handleImageError } from '@/lib/imageUtils';
import type { 
  Branding, Event, FAQ, GalleryImage, Sponsor, TeamMember, Announcement, About 
} from '@/hooks/useSupabaseData';

type TabType = 'dashboard' | 'branding' | 'events' | 'gallery' | 'announcements' | 'hero' | 'about' | 'college' | 'sponsors' | 'team';

// Extended types for editing
interface EditingEvent extends Partial<Event> {
  faqs?: FAQ[];
}

interface EditingAnnouncement extends Partial<Announcement> {}
interface EditingSponsor extends Partial<Sponsor> {}
interface EditingTeamMember extends Partial<TeamMember> {}

const Panel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();

  // Data states
  const [events, setEvents] = useState<(Event & { faqs: FAQ[] })[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [editingEvent, setEditingEvent] = useState<EditingEvent | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<EditingAnnouncement | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<EditingSponsor | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<EditingTeamMember | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Load data
  useEffect(() => {
    if (user && isAdmin) {
      loadAllData();
    }
  }, [user, isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBranding(),
        loadEvents(),
        loadGallery(),
        loadAnnouncements(),
        loadSponsors(),
        loadTeam(),
        loadAbout(),
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadBranding = async () => {
    const { data } = await supabase.from('branding').select('*').limit(1).maybeSingle();
    setBranding(data);
  };

  const loadEvents = async () => {
    const { data: eventsData } = await supabase.from('events').select('*');
    const { data: faqsData } = await supabase.from('faqs').select('*').order('priority', { ascending: true });
    
    const eventsWithFaqs = (eventsData || []).map(event => ({
      ...event,
      faqs: (faqsData || []).filter(faq => faq.event_id === event.id)
    }));
    setEvents(eventsWithFaqs);
  };

  const loadGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setGallery(data || []);
  };

  const loadAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('priority', { ascending: false });
    setAnnouncements(data || []);
  };

  const loadSponsors = async () => {
    const { data } = await supabase.from('sponsors').select('*');
    setSponsors(data || []);
  };

  const loadTeam = async () => {
    const { data } = await supabase.from('team').select('*');
    setTeam(data || []);
  };

  const loadAbout = async () => {
    const { data } = await supabase.from('about').select('*').limit(1).maybeSingle();
    setAbout(data);
  };

  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Logged out successfully' });
    navigate('/auth');
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branding' as TabType, label: 'Branding', icon: Sparkles },
    { id: 'events' as TabType, label: 'Events', icon: Calendar },
    { id: 'gallery' as TabType, label: 'Gallery', icon: Image },
    { id: 'announcements' as TabType, label: 'Announcements', icon: Bell },
    { id: 'sponsors' as TabType, label: 'Sponsors', icon: Award },
    { id: 'team' as TabType, label: 'Team', icon: Users },
    { id: 'about' as TabType, label: 'About', icon: Info },
  ];

  // === BRANDING HANDLERS ===
  const saveBranding = async () => {
    if (!branding) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('branding')
        .update({
          fest_name: branding.fest_name,
          college_name: branding.college_name,
          location: branding.location,
          logo_url: branding.logo_url,
          glow_color: branding.glow_color,
          hero_title: branding.hero_title,
          hero_subtitle: branding.hero_subtitle,
          hero_date: branding.hero_date,
          hero_venue: branding.hero_venue,
          hero_logo: branding.hero_logo,
        })
        .eq('id', branding.id);

      if (error) throw error;
      toast({ title: 'Branding updated!' });
    } catch (err) {
      toast({ title: 'Error saving branding', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // === EVENT HANDLERS ===
  const saveEvent = async () => {
    if (!editingEvent) return;
    setSaving(true);
    try {
      const eventData = {
        name: editingEvent.name || '',
        category: editingEvent.category || 'Technical',
        date: editingEvent.date || null,
        time: editingEvent.time || null,
        description: editingEvent.description || null,
        poster_url: editingEvent.poster_url || null,
        logo_url: editingEvent.logo_url || null,
        accent_color: editingEvent.accent_color || '#00f0ff',
        registration_url: editingEvent.registration_url || null,
      };

      let eventId = editingEvent.id;

      if (editingEvent.id) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single();
        if (error) throw error;
        eventId = data.id;
      }

      // Handle FAQs
      if (eventId && editingEvent.faqs) {
        // Delete existing FAQs for this event
        await supabase.from('faqs').delete().eq('event_id', eventId);
        
        // Insert new FAQs
        if (editingEvent.faqs.length > 0) {
          const faqsToInsert = editingEvent.faqs.map((faq, index) => ({
            event_id: eventId,
            question: faq.question,
            answer: faq.answer,
            priority: index,
          }));
          await supabase.from('faqs').insert(faqsToInsert);
        }
      }

      await loadEvents();
      setEditingEvent(null);
      toast({ title: 'Event saved!' });
    } catch (err) {
      console.error('Error saving event:', err);
      toast({ title: 'Error saving event', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      // Delete FAQs first (foreign key constraint)
      await supabase.from('faqs').delete().eq('event_id', id);
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await loadEvents();
      toast({ title: 'Event deleted' });
    } catch (err) {
      toast({ title: 'Error deleting event', variant: 'destructive' });
    }
  };

  // === ANNOUNCEMENT HANDLERS ===
  const saveAnnouncement = async () => {
    if (!editingAnnouncement) return;
    setSaving(true);
    try {
      const announcementData = {
        title: editingAnnouncement.title || '',
        content: editingAnnouncement.content || '',
        date: editingAnnouncement.date || null,
        priority: editingAnnouncement.priority || 0,
      };

      if (editingAnnouncement.id) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('announcements').insert(announcementData);
        if (error) throw error;
      }

      await loadAnnouncements();
      setEditingAnnouncement(null);
      toast({ title: 'Announcement saved!' });
    } catch (err) {
      toast({ title: 'Error saving announcement', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      await loadAnnouncements();
      toast({ title: 'Announcement deleted' });
    } catch (err) {
      toast({ title: 'Error deleting announcement', variant: 'destructive' });
    }
  };

  // === GALLERY HANDLERS ===
  const addGalleryImage = async () => {
    if (!newGalleryUrl) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('gallery').insert({
        image_url: newGalleryUrl,
        caption: newGalleryCaption || null,
      });
      if (error) throw error;
      await loadGallery();
      setNewGalleryUrl('');
      setNewGalleryCaption('');
      toast({ title: 'Image added!' });
    } catch (err) {
      toast({ title: 'Error adding image', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      await loadGallery();
      toast({ title: 'Image deleted' });
    } catch (err) {
      toast({ title: 'Error deleting image', variant: 'destructive' });
    }
  };

  // === SPONSOR HANDLERS ===
  const saveSponsor = async () => {
    if (!editingSponsor) return;
    setSaving(true);
    try {
      const sponsorData = {
        name: editingSponsor.name || '',
        category: editingSponsor.category || 'Supporter',
        logo_url: editingSponsor.logo_url || null,
        website: editingSponsor.website || null,
      };

      if (editingSponsor.id) {
        const { error } = await supabase
          .from('sponsors')
          .update(sponsorData)
          .eq('id', editingSponsor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sponsors').insert(sponsorData);
        if (error) throw error;
      }

      await loadSponsors();
      setEditingSponsor(null);
      toast({ title: 'Sponsor saved!' });
    } catch (err) {
      toast({ title: 'Error saving sponsor', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteSponsor = async (id: string) => {
    try {
      const { error } = await supabase.from('sponsors').delete().eq('id', id);
      if (error) throw error;
      await loadSponsors();
      toast({ title: 'Sponsor deleted' });
    } catch (err) {
      toast({ title: 'Error deleting sponsor', variant: 'destructive' });
    }
  };

  // === TEAM HANDLERS ===
  const saveTeamMember = async () => {
    if (!editingTeamMember) return;
    setSaving(true);
    try {
      const memberData = {
        name: editingTeamMember.name || '',
        role: editingTeamMember.role || null,
        department: editingTeamMember.department || null,
        phone: editingTeamMember.phone || null,
        photo_url: editingTeamMember.photo_url || null,
        type: editingTeamMember.type || 'student',
      };

      if (editingTeamMember.id) {
        const { error } = await supabase
          .from('team')
          .update(memberData)
          .eq('id', editingTeamMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team').insert(memberData);
        if (error) throw error;
      }

      await loadTeam();
      setEditingTeamMember(null);
      toast({ title: 'Team member saved!' });
    } catch (err) {
      toast({ title: 'Error saving team member', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase.from('team').delete().eq('id', id);
      if (error) throw error;
      await loadTeam();
      toast({ title: 'Team member deleted' });
    } catch (err) {
      toast({ title: 'Error deleting team member', variant: 'destructive' });
    }
  };

  // === ABOUT HANDLERS ===
  const saveAbout = async () => {
    if (!about) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('about')
        .update({
          about: about.about,
          mission: about.mission,
          vision: about.vision,
          stat1: about.stat1,
          stat2: about.stat2,
          stat3: about.stat3,
          stat4: about.stat4,
        })
        .eq('id', about.id);

      if (error) throw error;
      toast({ title: 'About page updated!' });
    } catch (err) {
      toast({ title: 'Error saving about', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="font-rajdhani text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-orbitron text-xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="font-rajdhani text-muted-foreground mb-6">
            You don't have admin privileges. Contact the administrator to get access.
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold"
          >
            Sign Out
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen glass-card rounded-none border-r border-border/30 p-4 hidden lg:block">
          <div className="mb-8">
            <h1 className="font-orbitron text-xl font-bold gradient-text">Admin Panel</h1>
            <p className="font-rajdhani text-sm text-muted-foreground">AADHRITA 2026</p>
            <p className="font-rajdhani text-xs text-primary mt-1 truncate">{user?.email}</p>
          </div>

          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 font-rajdhani font-medium rounded-xl transition-all text-sm
                  ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary neon-border'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 mt-8 font-rajdhani font-medium 
              text-destructive hover:bg-destructive/10 rounded-xl transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-t border-border/30 p-2">
          <div className="flex justify-around overflow-x-auto">
            {tabs.slice(0, 5).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 rounded-xl flex-shrink-0 ${activeTab === tab.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              >
                <tab.icon className="w-5 h-5" />
              </button>
            ))}
            <button onClick={handleLogout} className="p-2 text-destructive flex-shrink-0">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 lg:pb-6 overflow-y-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">Dashboard</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-6">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{events.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Events</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <Award className="w-8 h-8 text-secondary mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{sponsors.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Sponsors</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <Users className="w-8 h-8 text-accent mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{team.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Team Members</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <Image className="w-8 h-8 text-primary mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{gallery.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Gallery Images</div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Branding */}
          {activeTab === 'branding' && branding && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">Branding & Hero Section</h2>
              <GlassCard className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Fest Name</label>
                    <input
                      type="text"
                      value={branding.fest_name || ''}
                      onChange={e => setBranding({ ...branding, fest_name: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">College Name</label>
                    <input
                      type="text"
                      value={branding.college_name || ''}
                      onChange={e => setBranding({ ...branding, college_name: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={branding.location || ''}
                    onChange={e => setBranding({ ...branding, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Logo URL</label>
                    <input
                      type="text"
                      value={branding.logo_url || ''}
                      onChange={e => setBranding({ ...branding, logo_url: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Glow Color</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={branding.glow_color || '#ff0040'}
                        onChange={e => setBranding({ ...branding, glow_color: e.target.value })}
                        className="w-16 h-12 rounded-lg cursor-pointer border-0"
                      />
                      <span className="font-mono text-sm text-muted-foreground">{branding.glow_color}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border/30 pt-4 mt-4">
                  <h3 className="font-orbitron text-lg font-semibold mb-4 text-foreground">Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Hero Title</label>
                      <input
                        type="text"
                        value={branding.hero_title || ''}
                        onChange={e => setBranding({ ...branding, hero_title: e.target.value })}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                      />
                    </div>
                    <div>
                      <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Hero Subtitle</label>
                      <input
                        type="text"
                        value={branding.hero_subtitle || ''}
                        onChange={e => setBranding({ ...branding, hero_subtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Hero Date</label>
                        <input
                          type="text"
                          value={branding.hero_date || ''}
                          onChange={e => setBranding({ ...branding, hero_date: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                        />
                      </div>
                      <div>
                        <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Hero Venue</label>
                        <input
                          type="text"
                          value={branding.hero_venue || ''}
                          onChange={e => setBranding({ ...branding, hero_venue: e.target.value })}
                          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Hero Logo URL</label>
                      <input
                        type="text"
                        value={branding.hero_logo || ''}
                        onChange={e => setBranding({ ...branding, hero_logo: e.target.value })}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                      />
                    </div>
                  </div>
                </div>

                {branding.logo_url && (
                  <div className="p-6 bg-background/50 rounded-xl flex flex-col items-center gap-4">
                    <span className="font-rajdhani text-sm text-muted-foreground">Logo Preview with Glow</span>
                    <div
                      className="animate-pulse-slow"
                      style={{
                        filter: `drop-shadow(0 0 15px ${branding.glow_color}) drop-shadow(0 0 30px ${branding.glow_color})`,
                      }}
                    >
                      <img 
                        src={processImageUrl(branding.logo_url)} 
                        alt="Logo Preview" 
                        className="h-24 w-auto object-contain"
                        onError={(e) => handleImageError(e, 'logo')}
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={saveBranding} 
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Branding
                </button>
              </GlassCard>
            </div>
          )}

          {/* Events Management */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-2xl font-bold gradient-text">Manage Events</h2>
                <button
                  onClick={() => setEditingEvent({ 
                    name: '', category: 'Technical', date: '', time: '', 
                    description: '', poster_url: '', logo_url: '', 
                    accent_color: '#00f0ff', registration_url: '', faqs: [] 
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              </div>

              {editingEvent && (
                <GlassCard className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={editingEvent.name || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Category (e.g., Technical, Cultural)"
                      value={editingEvent.category || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g., March 15, 2026)"
                      value={editingEvent.date || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={editingEvent.time || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={editingEvent.description || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Poster Image URL"
                      value={editingEvent.poster_url || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, poster_url: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Event Logo URL"
                      value={editingEvent.logo_url || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, logo_url: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Registration URL</label>
                    <input
                      type="text"
                      placeholder="https://forms.google.com/..."
                      value={editingEvent.registration_url || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, registration_url: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="font-rajdhani text-sm text-muted-foreground">Accent Color:</label>
                    <input
                      type="color"
                      value={editingEvent.accent_color || '#00f0ff'}
                      onChange={e => setEditingEvent({ ...editingEvent, accent_color: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <span className="font-mono text-sm text-muted-foreground">{editingEvent.accent_color}</span>
                  </div>

                  {/* FAQ Management Section */}
                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-orbitron text-base font-semibold flex items-center gap-2 text-primary">
                        <HelpCircle className="w-4 h-4" />
                        Event FAQs
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaq: FAQ = { id: crypto.randomUUID(), event_id: '', question: '', answer: '', priority: 0 };
                          setEditingEvent({ ...editingEvent, faqs: [...(editingEvent.faqs || []), newFaq] });
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg font-rajdhani hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add FAQ
                      </button>
                    </div>

                    {(editingEvent.faqs || []).map((faq, faqIndex) => (
                      <div key={faq.id} className="glass-card p-4 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="font-rajdhani text-xs text-muted-foreground">FAQ #{faqIndex + 1}</span>
                          <div className="flex items-center gap-1">
                            {faqIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const faqs = [...(editingEvent.faqs || [])];
                                  [faqs[faqIndex - 1], faqs[faqIndex]] = [faqs[faqIndex], faqs[faqIndex - 1]];
                                  setEditingEvent({ ...editingEvent, faqs });
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                            )}
                            {faqIndex < (editingEvent.faqs || []).length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const faqs = [...(editingEvent.faqs || [])];
                                  [faqs[faqIndex], faqs[faqIndex + 1]] = [faqs[faqIndex + 1], faqs[faqIndex]];
                                  setEditingEvent({ ...editingEvent, faqs });
                                }}
                                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const faqs = (editingEvent.faqs || []).filter(f => f.id !== faq.id);
                                setEditingEvent({ ...editingEvent, faqs });
                              }}
                              className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={e => {
                            const faqs = (editingEvent.faqs || []).map(f => 
                              f.id === faq.id ? { ...f, question: e.target.value } : f
                            );
                            setEditingEvent({ ...editingEvent, faqs });
                          }}
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg font-rajdhani text-sm"
                        />
                        <textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={e => {
                            const faqs = (editingEvent.faqs || []).map(f => 
                              f.id === faq.id ? { ...f, answer: e.target.value } : f
                            );
                            setEditingEvent({ ...editingEvent, faqs });
                          }}
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg font-rajdhani text-sm h-16"
                        />
                      </div>
                    ))}

                    {(!editingEvent.faqs || editingEvent.faqs.length === 0) && (
                      <div className="text-center py-6 text-muted-foreground font-rajdhani text-sm">
                        No FAQs added yet. Click "Add FAQ" to create questions.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={saveEvent} 
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingEvent(null)} 
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </GlassCard>
              )}

              <div className="grid gap-4">
                {events.map(event => (
                  <GlassCard key={event.id} className="p-4 flex items-center gap-4">
                    <div 
                      className="w-2 h-16 rounded-full" 
                      style={{ backgroundColor: event.accent_color || '#00f0ff' }}
                    />
                    <img 
                      src={processImageUrl(event.poster_url)} 
                      alt={event.name} 
                      className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => handleImageError(e, 'event')}
                    />
                    <div className="flex-1">
                      <h3 className="font-orbitron font-bold text-foreground">{event.name}</h3>
                      <p className="font-rajdhani text-sm text-muted-foreground">{event.category} • {event.date}</p>
                      <p className="font-rajdhani text-xs text-primary mt-1">
                        <HelpCircle className="w-3 h-3 inline mr-1" />
                        {event.faqs?.length || 0} FAQs
                      </p>
                    </div>
                    <button 
                      onClick={() => setEditingEvent({ ...event, faqs: event.faqs || [] })} 
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteEvent(event.id)} 
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Management */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">Manage Gallery</h2>
              
              <GlassCard className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newGalleryUrl}
                    onChange={e => setNewGalleryUrl(e.target.value)}
                    className="md:col-span-2 px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <input
                    type="text"
                    placeholder="Caption"
                    value={newGalleryCaption}
                    onChange={e => setNewGalleryCaption(e.target.value)}
                    className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                <button 
                  onClick={addGalleryImage} 
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Image
                </button>
              </GlassCard>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map(image => (
                  <GlassCard key={image.id} className="p-2 relative group">
                    <img 
                      src={processImageUrl(image.image_url)} 
                      alt={image.caption || 'Gallery'} 
                      className="w-full h-40 object-cover rounded-xl"
                      onError={(e) => handleImageError(e, 'gallery')}
                    />
                    <p className="font-rajdhani text-sm text-muted-foreground mt-2 px-2">{image.caption}</p>
                    <button
                      onClick={() => deleteGalleryImage(image.id)}
                      className="absolute top-4 right-4 p-2 bg-destructive/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Management */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-2xl font-bold gradient-text">Manage Announcements</h2>
                <button
                  onClick={() => setEditingAnnouncement({ title: '', content: '', date: new Date().toISOString().split('T')[0], priority: 0 })}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Announcement
                </button>
              </div>

              {editingAnnouncement && (
                <GlassCard className="p-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editingAnnouncement.title || ''}
                    onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <textarea
                    placeholder="Content"
                    value={editingAnnouncement.content || ''}
                    onChange={e => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Date (e.g., January 15, 2026)"
                      value={editingAnnouncement.date || ''}
                      onChange={e => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="number"
                      placeholder="Priority (higher = more important)"
                      value={editingAnnouncement.priority || 0}
                      onChange={e => setEditingAnnouncement({ ...editingAnnouncement, priority: parseInt(e.target.value) || 0 })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={saveAnnouncement} 
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingAnnouncement(null)} 
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </GlassCard>
              )}

              <div className="space-y-4">
                {announcements.map(announcement => (
                  <GlassCard key={announcement.id} className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-orbitron font-bold text-foreground">{announcement.title}</h3>
                      <p className="font-rajdhani text-sm text-muted-foreground line-clamp-1">{announcement.content}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-rajdhani font-semibold rounded-full bg-primary/20 text-primary">
                      Priority: {announcement.priority}
                    </span>
                    <button 
                      onClick={() => setEditingAnnouncement(announcement)} 
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteAnnouncement(announcement.id)} 
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Sponsors Management */}
          {activeTab === 'sponsors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-2xl font-bold gradient-text">Manage Sponsors</h2>
                <button
                  onClick={() => setEditingSponsor({ name: '', logo_url: '', category: 'Supporter', website: '' })}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Sponsor
                </button>
              </div>

              {editingSponsor && (
                <GlassCard className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Sponsor Name"
                      value={editingSponsor.name || ''}
                      onChange={e => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <select
                      value={editingSponsor.category || 'Supporter'}
                      onChange={e => setEditingSponsor({ ...editingSponsor, category: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    >
                      <option value="Title">Title Sponsor</option>
                      <option value="Gold">Gold Sponsor</option>
                      <option value="Silver">Silver Sponsor</option>
                      <option value="Supporter">Supporter</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Logo URL"
                    value={editingSponsor.logo_url || ''}
                    onChange={e => setEditingSponsor({ ...editingSponsor, logo_url: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <input
                    type="text"
                    placeholder="Website URL (optional)"
                    value={editingSponsor.website || ''}
                    onChange={e => setEditingSponsor({ ...editingSponsor, website: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={saveSponsor} 
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingSponsor(null)} 
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </GlassCard>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map(sponsor => (
                  <GlassCard key={sponsor.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={processImageUrl(sponsor.logo_url)} 
                        alt={sponsor.name} 
                        className="w-16 h-16 object-cover rounded-xl"
                        onError={(e) => handleImageError(e, 'sponsor')}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-orbitron font-bold text-foreground truncate">{sponsor.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-rajdhani font-semibold rounded-full
                          ${sponsor.category === 'Title' ? 'bg-yellow-500/20 text-yellow-500' :
                            sponsor.category === 'Gold' ? 'bg-yellow-400/20 text-yellow-400' :
                            sponsor.category === 'Silver' ? 'bg-slate-400/20 text-slate-400' :
                            'bg-rose-400/20 text-rose-400'}`}>
                          {sponsor.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button 
                        onClick={() => setEditingSponsor(sponsor)} 
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteSponsor(sponsor.id)} 
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Team Management */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-2xl font-bold gradient-text">Manage Team</h2>
                <button
                  onClick={() => setEditingTeamMember({ name: '', role: '', department: '', phone: '', photo_url: '', type: 'student' })}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>

              {editingTeamMember && (
                <GlassCard className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={editingTeamMember.name || ''}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <select
                      value={editingTeamMember.type || 'student'}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, type: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    >
                      <option value="student">Student Coordinator</option>
                      <option value="faculty">Faculty Coordinator</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Role"
                      value={editingTeamMember.role || ''}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    {editingTeamMember.type === 'faculty' && (
                      <input
                        type="text"
                        placeholder="Department"
                        value={editingTeamMember.department || ''}
                        onChange={e => setEditingTeamMember({ ...editingTeamMember, department: e.target.value })}
                        className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Phone"
                      value={editingTeamMember.phone || ''}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, phone: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Photo URL"
                    value={editingTeamMember.photo_url || ''}
                    onChange={e => setEditingTeamMember({ ...editingTeamMember, photo_url: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={saveTeamMember} 
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingTeamMember(null)} 
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Student Coordinators */}
              <div>
                <h3 className="font-orbitron text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Student Coordinators
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.filter(m => m.type === 'student').map(member => (
                    <GlassCard key={member.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={processImageUrl(member.photo_url)} 
                          alt={member.name} 
                          className="w-14 h-14 object-cover rounded-full"
                          onError={(e) => handleImageError(e, 'team')}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-orbitron font-bold text-foreground text-sm truncate">{member.name}</h4>
                          <p className="font-rajdhani text-xs text-primary">{member.role}</p>
                          <p className="font-rajdhani text-xs text-muted-foreground">{member.phone}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button 
                          onClick={() => setEditingTeamMember(member)} 
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTeamMember(member.id)} 
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Faculty Coordinators */}
              <div>
                <h3 className="font-orbitron text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary" /> Faculty Coordinators
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.filter(m => m.type === 'faculty').map(member => (
                    <GlassCard key={member.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={processImageUrl(member.photo_url)} 
                          alt={member.name} 
                          className="w-14 h-14 object-cover rounded-full"
                          onError={(e) => handleImageError(e, 'team')}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-orbitron font-bold text-foreground text-sm truncate">{member.name}</h4>
                          <p className="font-rajdhani text-xs text-primary">{member.role}</p>
                          <p className="font-rajdhani text-xs text-muted-foreground">{member.department}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button 
                          onClick={() => setEditingTeamMember(member)} 
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTeamMember(member.id)} 
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* About Management */}
          {activeTab === 'about' && about && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">About Page</h2>
              <GlassCard className="p-6 space-y-4">
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">About Description</label>
                  <textarea
                    placeholder="About the fest..."
                    value={about.about || ''}
                    onChange={e => setAbout({ ...about, about: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-32"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Mission</label>
                  <textarea
                    placeholder="Our mission..."
                    value={about.mission || ''}
                    onChange={e => setAbout({ ...about, mission: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Vision</label>
                  <textarea
                    placeholder="Our vision..."
                    value={about.vision || ''}
                    onChange={e => setAbout({ ...about, vision: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Stat 1 (e.g., 5000+ Participants)</label>
                    <input
                      type="text"
                      value={about.stat1 || ''}
                      onChange={e => setAbout({ ...about, stat1: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Stat 2 (e.g., 50+ Events)</label>
                    <input
                      type="text"
                      value={about.stat2 || ''}
                      onChange={e => setAbout({ ...about, stat2: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Stat 3 (e.g., 100+ Colleges)</label>
                    <input
                      type="text"
                      value={about.stat3 || ''}
                      onChange={e => setAbout({ ...about, stat3: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Stat 4 (e.g., 3 Days)</label>
                    <input
                      type="text"
                      value={about.stat4 || ''}
                      onChange={e => setAbout({ ...about, stat4: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                </div>
                <button 
                  onClick={saveAbout} 
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save About
                </button>
              </GlassCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Panel;
