import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Image, Bell, Settings, LogOut, Plus, Trash2, Edit2, Save, X, Home, Info,
  Building2, Users, GraduationCap, Award, Palette, Sparkles
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/hooks/use-toast';
import {
  isAdminAuthenticated, adminLogout, getEvents, saveEvents, getAnnouncements, saveAnnouncements,
  getGallery, saveGallery, getSettings, updateHeroContent, updateAboutContent, updateCollegeBranding,
  getSponsors, saveSponsors, getTeam, saveTeam, getAadhritaBranding, updateAadhritaBranding,
  type Event, type Announcement, type GalleryImage, type HeroContent, type AboutContent, 
  type CollegeBranding, type Sponsor, type TeamMember, type AadhritaBranding
} from '@/lib/storage';

type TabType = 'dashboard' | 'branding' | 'events' | 'gallery' | 'announcements' | 'hero' | 'about' | 'college' | 'sponsors' | 'team';

const Panel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [collegeBranding, setCollegeBranding] = useState<CollegeBranding | null>(null);
  const [aadhritaBranding, setAadhritaBranding] = useState<AadhritaBranding | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Edit states
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    setEvents(getEvents());
    setAnnouncements(getAnnouncements());
    setGallery(getGallery());
    const settings = getSettings();
    setHeroContent(settings.heroContent);
    setAboutContent(settings.aboutContent);
    setCollegeBranding(settings.collegeBranding);
    setAadhritaBranding(getAadhritaBranding());
    setSponsors(getSponsors());
    setTeam(getTeam());
  };

  const handleLogout = () => {
    adminLogout();
    toast({ title: 'Logged out successfully' });
    navigate('/admin');
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branding' as TabType, label: 'AADHRITA Logo', icon: Sparkles },
    { id: 'college' as TabType, label: 'College', icon: Building2 },
    { id: 'events' as TabType, label: 'Events', icon: Calendar },
    { id: 'gallery' as TabType, label: 'Gallery', icon: Image },
    { id: 'announcements' as TabType, label: 'Announcements', icon: Bell },
    { id: 'sponsors' as TabType, label: 'Sponsors', icon: Award },
    { id: 'team' as TabType, label: 'Team', icon: Users },
    { id: 'hero' as TabType, label: 'Hero', icon: Home },
    { id: 'about' as TabType, label: 'About', icon: Info },
  ];

  // AADHRITA Branding handlers
  const saveAadhrita = () => {
    if (!aadhritaBranding) return;
    updateAadhritaBranding(aadhritaBranding);
    toast({ title: 'AADHRITA branding updated!' });
  };

  // Event handlers
  const saveEvent = () => {
    if (!editingEvent) return;
    const updatedEvents = editingEvent.id
      ? events.map(e => e.id === editingEvent.id ? editingEvent : e)
      : [...events, { ...editingEvent, id: Date.now().toString() }];
    saveEvents(updatedEvents);
    setEvents(updatedEvents);
    setEditingEvent(null);
    toast({ title: 'Event saved successfully!' });
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    saveEvents(updatedEvents);
    setEvents(updatedEvents);
    toast({ title: 'Event deleted' });
  };

  // Announcement handlers
  const saveAnnouncement = () => {
    if (!editingAnnouncement) return;
    const updatedAnnouncements = editingAnnouncement.id
      ? announcements.map(a => a.id === editingAnnouncement.id ? editingAnnouncement : a)
      : [{ ...editingAnnouncement, id: Date.now().toString() }, ...announcements];
    saveAnnouncements(updatedAnnouncements);
    setAnnouncements(updatedAnnouncements);
    setEditingAnnouncement(null);
    toast({ title: 'Announcement saved!' });
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    saveAnnouncements(updated);
    setAnnouncements(updated);
    toast({ title: 'Announcement deleted' });
  };

  // Gallery handlers
  const addGalleryImage = () => {
    if (!newGalleryUrl) return;
    const newImage: GalleryImage = { id: Date.now().toString(), url: newGalleryUrl, caption: newGalleryCaption };
    const updated = [...gallery, newImage];
    saveGallery(updated);
    setGallery(updated);
    setNewGalleryUrl('');
    setNewGalleryCaption('');
    toast({ title: 'Image added to gallery!' });
  };

  const deleteGalleryImage = (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    saveGallery(updated);
    setGallery(updated);
    toast({ title: 'Image removed' });
  };

  // Hero handlers
  const saveHero = () => {
    if (!heroContent) return;
    updateHeroContent(heroContent);
    toast({ title: 'Hero section updated!' });
  };

  // About handlers
  const saveAbout = () => {
    if (!aboutContent) return;
    updateAboutContent(aboutContent);
    toast({ title: 'About page updated!' });
  };

  // College branding handlers
  const saveCollege = () => {
    if (!collegeBranding) return;
    updateCollegeBranding(collegeBranding);
    toast({ title: 'College branding updated!' });
  };

  // Sponsor handlers
  const saveSponsor = () => {
    if (!editingSponsor) return;
    const updatedSponsors = editingSponsor.id
      ? sponsors.map(s => s.id === editingSponsor.id ? editingSponsor : s)
      : [...sponsors, { ...editingSponsor, id: Date.now().toString() }];
    saveSponsors(updatedSponsors);
    setSponsors(updatedSponsors);
    setEditingSponsor(null);
    toast({ title: 'Sponsor saved!' });
  };

  const deleteSponsor = (id: string) => {
    const updated = sponsors.filter(s => s.id !== id);
    saveSponsors(updated);
    setSponsors(updated);
    toast({ title: 'Sponsor deleted' });
  };

  // Team handlers
  const saveTeamMember = () => {
    if (!editingTeamMember) return;
    const updatedTeam = editingTeamMember.id
      ? team.map(m => m.id === editingTeamMember.id ? editingTeamMember : m)
      : [...team, { ...editingTeamMember, id: Date.now().toString() }];
    saveTeam(updatedTeam);
    setTeam(updatedTeam);
    setEditingTeamMember(null);
    toast({ title: 'Team member saved!' });
  };

  const deleteTeamMember = (id: string) => {
    const updated = team.filter(m => m.id !== id);
    saveTeam(updated);
    setTeam(updated);
    toast({ title: 'Team member deleted' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen glass-card rounded-none border-r border-border/30 p-4 hidden lg:block">
          <div className="mb-8">
            <h1 className="font-orbitron text-xl font-bold gradient-text">Admin Panel</h1>
            <p className="font-rajdhani text-sm text-muted-foreground">AADHRITA 2026</p>
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

          {/* AADHRITA Branding */}
          {activeTab === 'branding' && aadhritaBranding && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">AADHRITA Official Branding</h2>
              <GlassCard className="p-6 space-y-6">
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">AADHRITA Official Logo URL</label>
                  <input
                    type="text"
                    placeholder="Logo Image URL"
                    value={aadhritaBranding.logoUrl}
                    onChange={e => setAadhritaBranding({ ...aadhritaBranding, logoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Logo Glow Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={aadhritaBranding.glowColor}
                      onChange={e => setAadhritaBranding({ ...aadhritaBranding, glowColor: e.target.value })}
                      className="w-16 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <span className="font-mono text-sm text-muted-foreground">{aadhritaBranding.glowColor}</span>
                    <span className="font-rajdhani text-xs text-muted-foreground">(Red neon recommended: #ef4444)</span>
                  </div>
                </div>
                {aadhritaBranding.logoUrl && (
                  <div className="p-6 bg-background/50 rounded-xl flex flex-col items-center gap-4">
                    <span className="font-rajdhani text-sm text-muted-foreground">Logo Preview with Glow Effect</span>
                    <div
                      className="animate-pulse-slow"
                      style={{
                        filter: `drop-shadow(0 0 15px ${aadhritaBranding.glowColor}) drop-shadow(0 0 30px ${aadhritaBranding.glowColor}) drop-shadow(0 0 45px ${aadhritaBranding.glowColor}40)`,
                      }}
                    >
                      <img src={aadhritaBranding.logoUrl} alt="AADHRITA Logo Preview" className="h-24 w-auto object-contain" />
                    </div>
                    <span 
                      className="font-orbitron text-3xl font-bold"
                      style={{
                        color: aadhritaBranding.glowColor,
                        textShadow: `0 0 10px ${aadhritaBranding.glowColor}, 0 0 20px ${aadhritaBranding.glowColor}, 0 0 30px ${aadhritaBranding.glowColor}40`,
                      }}
                    >
                      AADHRITA
                    </span>
                  </div>
                )}
                <button onClick={saveAadhrita} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold">
                  <Save className="w-4 h-4" /> Save Branding
                </button>
              </GlassCard>
            </div>
          )}

          {/* College Branding */}
          {activeTab === 'college' && collegeBranding && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">College Branding</h2>
              <GlassCard className="p-6 space-y-4">
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">College Name</label>
                  <input
                    type="text"
                    placeholder="College Name"
                    value={collegeBranding.collegeName}
                    onChange={e => setCollegeBranding({ ...collegeBranding, collegeName: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={collegeBranding.location}
                    onChange={e => setCollegeBranding({ ...collegeBranding, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-sm text-muted-foreground mb-2">College Logo URL</label>
                  <input
                    type="text"
                    placeholder="Logo URL"
                    value={collegeBranding.logoUrl}
                    onChange={e => setCollegeBranding({ ...collegeBranding, logoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                {collegeBranding.logoUrl && (
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                    <img src={collegeBranding.logoUrl} alt="Preview" className="h-16 w-auto object-contain" />
                    <span className="font-rajdhani text-sm text-muted-foreground">Logo Preview</span>
                  </div>
                )}
                <button onClick={saveCollege} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold">
                  <Save className="w-4 h-4" /> Save Changes
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
                  onClick={() => setEditingEvent({ id: '', name: '', description: '', rules: [], date: '', time: '', posterUrl: '', category: '', logoUrl: '', accentColor: '#00d4ff', registrationUrl: '' })}
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
                      value={editingEvent.name}
                      onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={editingEvent.category}
                      onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g., March 15, 2026)"
                      value={editingEvent.date}
                      onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={editingEvent.time}
                      onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={editingEvent.description}
                    onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Poster Image URL"
                      value={editingEvent.posterUrl}
                      onChange={e => setEditingEvent({ ...editingEvent, posterUrl: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <input
                      type="text"
                      placeholder="Event Logo URL"
                      value={editingEvent.logoUrl || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, logoUrl: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-sm text-muted-foreground mb-2">Registration URL (Google Form / External Link)</label>
                    <input
                      type="text"
                      placeholder="https://forms.google.com/..."
                      value={editingEvent.registrationUrl || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, registrationUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="font-rajdhani text-sm text-muted-foreground">Accent Color:</label>
                    <input
                      type="color"
                      value={editingEvent.accentColor || '#00d4ff'}
                      onChange={e => setEditingEvent({ ...editingEvent, accentColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <span className="font-mono text-sm text-muted-foreground">{editingEvent.accentColor}</span>
                  </div>
                  <textarea
                    placeholder="Rules (one per line)"
                    value={editingEvent.rules.join('\n')}
                    onChange={e => setEditingEvent({ ...editingEvent, rules: e.target.value.split('\n').filter(r => r.trim()) })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEvent} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditingEvent(null)} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani">
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
                      style={{ backgroundColor: event.accentColor || '#00d4ff' }}
                    />
                    <img src={event.posterUrl} alt={event.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h3 className="font-orbitron font-bold text-foreground">{event.name}</h3>
                      <p className="font-rajdhani text-sm text-muted-foreground">{event.category} • {event.date}</p>
                    </div>
                    <button onClick={() => setEditingEvent(event)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
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
                <button onClick={addGalleryImage} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani">
                  <Plus className="w-4 h-4" /> Add Image
                </button>
              </GlassCard>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map(image => (
                  <GlassCard key={image.id} className="p-2 relative group">
                    <img src={image.url} alt={image.caption} className="w-full h-40 object-cover rounded-xl" />
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
                  onClick={() => setEditingAnnouncement({ id: '', title: '', content: '', date: new Date().toISOString().split('T')[0], priority: 'medium' })}
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
                    value={editingAnnouncement.title}
                    onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <textarea
                    placeholder="Content"
                    value={editingAnnouncement.content}
                    onChange={e => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={editingAnnouncement.date}
                      onChange={e => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <select
                      value={editingAnnouncement.priority}
                      onChange={e => setEditingAnnouncement({ ...editingAnnouncement, priority: e.target.value as 'high' | 'medium' | 'low' })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveAnnouncement} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditingAnnouncement(null)} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani">
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
                    <span className={`px-3 py-1 text-xs font-rajdhani font-semibold rounded-full
                      ${announcement.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                        announcement.priority === 'medium' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                      {announcement.priority}
                    </span>
                    <button onClick={() => setEditingAnnouncement(announcement)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteAnnouncement(announcement.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
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
                  onClick={() => setEditingSponsor({ id: '', name: '', logoUrl: '', category: 'Gold', websiteUrl: '' })}
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
                      value={editingSponsor.name}
                      onChange={e => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <select
                      value={editingSponsor.category}
                      onChange={e => setEditingSponsor({ ...editingSponsor, category: e.target.value as Sponsor['category'] })}
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
                    value={editingSponsor.logoUrl}
                    onChange={e => setEditingSponsor({ ...editingSponsor, logoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <input
                    type="text"
                    placeholder="Website URL (optional)"
                    value={editingSponsor.websiteUrl || ''}
                    onChange={e => setEditingSponsor({ ...editingSponsor, websiteUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveSponsor} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditingSponsor(null)} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </GlassCard>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map(sponsor => (
                  <GlassCard key={sponsor.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="w-16 h-16 object-cover rounded-xl" />
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
                      <button onClick={() => setEditingSponsor(sponsor)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteSponsor(sponsor.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
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
                  onClick={() => setEditingTeamMember({ id: '', name: '', role: '', department: '', phone: '', photoUrl: '', type: 'student' })}
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
                      value={editingTeamMember.name}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                    <select
                      value={editingTeamMember.type}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, type: e.target.value as 'student' | 'faculty' })}
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
                      value={editingTeamMember.role}
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
                      value={editingTeamMember.phone}
                      onChange={e => setEditingTeamMember({ ...editingTeamMember, phone: e.target.value })}
                      className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Photo URL"
                    value={editingTeamMember.photoUrl}
                    onChange={e => setEditingTeamMember({ ...editingTeamMember, photoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveTeamMember} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-rajdhani">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditingTeamMember(null)} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-rajdhani">
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
                        <img src={member.photoUrl} alt={member.name} className="w-14 h-14 object-cover rounded-full" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-orbitron font-bold text-foreground text-sm truncate">{member.name}</h4>
                          <p className="font-rajdhani text-xs text-primary">{member.role}</p>
                          <p className="font-rajdhani text-xs text-muted-foreground">{member.phone}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => setEditingTeamMember(member)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTeamMember(member.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg">
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
                        <img src={member.photoUrl} alt={member.name} className="w-14 h-14 object-cover rounded-full" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-orbitron font-bold text-foreground text-sm truncate">{member.name}</h4>
                          <p className="font-rajdhani text-xs text-primary">{member.role}</p>
                          <p className="font-rajdhani text-xs text-muted-foreground">{member.department}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => setEditingTeamMember(member)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTeamMember(member.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hero Section Management */}
          {activeTab === 'hero' && heroContent && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">Hero Section</h2>
              <GlassCard className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Fest Name"
                  value={heroContent.festName}
                  onChange={e => setHeroContent({ ...heroContent, festName: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                />
                <input
                  type="text"
                  placeholder="Tagline"
                  value={heroContent.tagline}
                  onChange={e => setHeroContent({ ...heroContent, tagline: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Date"
                    value={heroContent.date}
                    onChange={e => setHeroContent({ ...heroContent, date: e.target.value })}
                    className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                  <input
                    type="text"
                    placeholder="Venue"
                    value={heroContent.venue}
                    onChange={e => setHeroContent({ ...heroContent, venue: e.target.value })}
                    className="px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Logo URL"
                  value={heroContent.logoUrl}
                  onChange={e => setHeroContent({ ...heroContent, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                />
                <button onClick={saveHero} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </GlassCard>
            </div>
          )}

          {/* About Page Management */}
          {activeTab === 'about' && aboutContent && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">About Page</h2>
              <GlassCard className="p-6 space-y-4">
                <textarea
                  placeholder="Description"
                  value={aboutContent.description}
                  onChange={e => setAboutContent({ ...aboutContent, description: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-32"
                />
                <textarea
                  placeholder="Mission"
                  value={aboutContent.mission}
                  onChange={e => setAboutContent({ ...aboutContent, mission: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                />
                <textarea
                  placeholder="Vision"
                  value={aboutContent.vision}
                  onChange={e => setAboutContent({ ...aboutContent, vision: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                />
                <textarea
                  placeholder="Highlights (one per line)"
                  value={aboutContent.highlights.join('\n')}
                  onChange={e => setAboutContent({ ...aboutContent, highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani h-24"
                />
                <button onClick={saveAbout} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-rajdhani font-semibold">
                  <Save className="w-4 h-4" /> Save Changes
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
