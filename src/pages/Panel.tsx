import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Image, Bell, Settings, LogOut, Plus, Trash2, Edit2, Save, X, Home, Info
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useToast } from '@/hooks/use-toast';
import {
  isAdminAuthenticated, adminLogout, getEvents, saveEvents, getAnnouncements, saveAnnouncements,
  getGallery, saveGallery, getSettings, updateHeroContent, updateAboutContent,
  type Event, type Announcement, type GalleryImage, type HeroContent, type AboutContent
} from '@/lib/storage';

type TabType = 'dashboard' | 'events' | 'gallery' | 'announcements' | 'hero' | 'about';

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

  // Edit states
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
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
  };

  const handleLogout = () => {
    adminLogout();
    toast({ title: 'Logged out successfully' });
    navigate('/admin');
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events' as TabType, label: 'Events', icon: Calendar },
    { id: 'gallery' as TabType, label: 'Gallery', icon: Image },
    { id: 'announcements' as TabType, label: 'Announcements', icon: Bell },
    { id: 'hero' as TabType, label: 'Hero Section', icon: Home },
    { id: 'about' as TabType, label: 'About Page', icon: Info },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen glass-card rounded-none border-r border-border/30 p-4 hidden md:block">
          <div className="mb-8">
            <h1 className="font-orbitron text-xl font-bold gradient-text">Admin Panel</h1>
            <p className="font-rajdhani text-sm text-muted-foreground">AADHRITA 2026</p>
          </div>

          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-rajdhani font-medium rounded-xl transition-all
                  ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary neon-border'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-8 font-rajdhani font-medium 
              text-destructive hover:bg-destructive/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-t border-border/30 p-2">
          <div className="flex justify-around">
            {tabs.slice(0, 4).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl ${activeTab === tab.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              >
                <tab.icon className="w-5 h-5" />
              </button>
            ))}
            <button onClick={handleLogout} className="p-3 text-destructive">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl font-bold gradient-text">Dashboard</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-6">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{events.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Total Events</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <Bell className="w-8 h-8 text-secondary mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{announcements.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Announcements</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <Image className="w-8 h-8 text-accent mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">{gallery.length}</div>
                  <div className="font-rajdhani text-muted-foreground">Gallery Images</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <Settings className="w-8 h-8 text-primary mb-2" />
                  <div className="font-orbitron text-3xl font-bold text-foreground">Active</div>
                  <div className="font-rajdhani text-muted-foreground">Site Status</div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Events Management */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-2xl font-bold gradient-text">Manage Events</h2>
                <button
                  onClick={() => setEditingEvent({ id: '', name: '', description: '', rules: [], date: '', time: '', posterUrl: '', category: '' })}
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
                  <input
                    type="text"
                    placeholder="Poster Image URL"
                    value={editingEvent.posterUrl}
                    onChange={e => setEditingEvent({ ...editingEvent, posterUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani"
                  />
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
