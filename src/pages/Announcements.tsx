import { useEffect, useState } from 'react';
import { Bell, AlertCircle, Info, Star } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import ParticleBackground from '@/components/ParticleBackground';
import { getAnnouncements, initializeStorage } from '@/lib/storage';
import type { Announcement } from '@/lib/storage';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    initializeStorage();
    setAnnouncements(getAnnouncements());
  }, []);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' };
      case 'medium':
        return { icon: Star, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' };
      default:
        return { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navigation />
      <CollegeBrandingBar />

      {/* Hero */}
      <section className="pt-44 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Bell className="w-8 h-8 text-primary animate-pulse-slow" />
            </div>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
              <span className="gradient-text">Announcements</span>
            </h1>
            <p className="font-rajdhani text-lg text-muted-foreground opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s' }}>
              Stay updated with the latest news, updates, and important notices.
            </p>
          </div>
        </div>
      </section>

      {/* Scrolling Ticker */}
      <section className="py-6 bg-primary/5 border-y border-primary/20 overflow-hidden">
        <div className="flex animate-scroll-x">
          {[...announcements, ...announcements, ...announcements].map((announcement, index) => (
            <div key={`ticker-${announcement.id}-${index}`} className="flex items-center gap-6 px-6 whitespace-nowrap">
              <span className="font-rajdhani font-semibold text-primary">🔔 {announcement.title}</span>
              <span className="text-muted-foreground/50">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {announcements.map((announcement, index) => {
              const config = getPriorityConfig(announcement.priority);
              const Icon = config.icon;

              return (
                <GlassCard
                  key={announcement.id}
                  hover
                  className={`p-6 opacity-0 animate-slide-up border-l-4 ${config.border}`}
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${config.bg}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <h3 className="font-orbitron text-lg font-bold text-foreground">
                          {announcement.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-rajdhani font-semibold rounded-full uppercase ${config.bg} ${config.color}`}>
                          {announcement.priority}
                        </span>
                      </div>
                      <p className="font-rajdhani text-muted-foreground mb-3">
                        {announcement.content}
                      </p>
                      <span className="text-sm text-muted-foreground/60 font-rajdhani">
                        Posted on {formatDate(announcement.date)}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {announcements.length === 0 && (
            <div className="text-center py-20">
              <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-rajdhani text-xl text-muted-foreground">No announcements yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Announcements;
