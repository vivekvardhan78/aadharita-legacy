import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users, Trophy, Zap, Rocket, Sparkles } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import EventCard from '@/components/EventCard';
import AadhritaLogo from '@/components/AadhritaLogo';
import CountdownTimer from '@/components/CountdownTimer';
import { useBranding, useEvents, useAnnouncements } from '@/hooks/useSupabaseData';

const Index = () => {
  const { branding, loading: brandingLoading } = useBranding();
  const { events, loading: eventsLoading } = useEvents();
  const { announcements, loading: announcementsLoading } = useAnnouncements();

  if (brandingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const highlights = branding?.fest_highlights?.split(',').map(h => h.trim()) || [
    'Technical Events',
    'Cultural Shows',
    'Workshops',
    'Competitions'
  ];

  const stats = [
    { icon: Users, value: '5000+', label: 'Participants' },
    { icon: Trophy, value: '₹10L', label: 'Prize Pool' },
    { icon: Zap, value: '50+', label: 'Events' },
    { icon: Rocket, value: '100+', label: 'Colleges' },
  ];

  const featuredEvents = events.slice(0, 3);
  const glowColor = branding?.glow_color || '#00f0ff';

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navigation />
      <CollegeBrandingBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" 
          style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Fest Intro */}
            {branding?.fest_intro && (
              <p className="font-rajdhani text-lg md:text-xl text-muted-foreground mb-6 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.1s' }}>
                {branding.fest_intro}
              </p>
            )}

            {/* Date Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card rounded-full
              opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-rajdhani text-sm text-muted-foreground">
                {branding?.fest_dates || branding?.hero_date || 'March 15-17, 2026'}
              </span>
            </div>

            {/* AADHRITA Logo with Neon Pulse */}
            <div className="flex justify-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="animate-logo-pulse">
                <AadhritaLogo size="xl" showText={false} />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black mb-6
              opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span 
                className="block animate-neon-flicker"
                style={{
                  color: glowColor,
                  textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}40, 0 0 60px ${glowColor}20`,
                }}
              >
                {branding?.hero_title?.split(' – ')[0] || branding?.fest_name || 'AADHRITA'}
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 gradient-text">
                – {branding?.hero_title?.split(' – ')[1] || '2026'}
              </span>
            </h1>

            {/* Theme */}
            {branding?.fest_theme && (
              <div className="flex items-center justify-center gap-2 mb-4 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
                <span className="font-orbitron text-lg md:text-xl text-secondary font-semibold">
                  {branding.fest_theme}
                </span>
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              </div>
            )}

            {/* Tagline */}
            <p className="font-rajdhani text-xl md:text-2xl text-muted-foreground mb-4
              opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {branding?.hero_subtitle || 'The Ultimate Tech & Cultural Fest'}
            </p>

            {/* Venue */}
            <div className="flex items-center justify-center gap-2 mb-8
              opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-rajdhani text-lg text-secondary">
                {branding?.hero_venue || branding?.college_name || 'MVGR College of Engineering'}
              </span>
            </div>

            {/* Countdown Timer */}
            {branding?.countdown_datetime && (
              <div className="mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <CountdownTimer 
                  targetDate={branding.countdown_datetime} 
                  glowColor={glowColor}
                />
              </div>
            )}

            {/* Highlights Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.9s' }}>
              {highlights.map((highlight, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 glass-card rounded-full font-rajdhani text-sm font-medium text-foreground
                    border border-primary/30 hover:border-primary/60 transition-colors"
                >
                  {highlight}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4
              opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
              <Link 
                to="/events"
                className="group px-8 py-4 font-rajdhani font-bold text-lg bg-primary text-primary-foreground 
                  rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.5)]
                  hover:scale-105 active:scale-95 flex items-center gap-2 animate-glow-pulse"
              >
                Explore Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="px-8 py-4 font-rajdhani font-bold text-lg neon-border rounded-xl
                text-foreground hover:bg-primary/10 transition-all duration-300 flex items-center gap-2">
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((item, index) => (
              <GlassCard
                key={item.label}
                className="p-6 text-center opacity-0 animate-slide-up"
                style={{ animationDelay: `${1.2 + index * 0.1}s` } as React.CSSProperties}
              >
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="font-orbitron text-2xl md:text-3xl font-bold gradient-text">{item.value}</div>
                <div className="font-rajdhani text-sm text-muted-foreground">{item.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
          opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <span className="font-rajdhani text-xs text-muted-foreground">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Neon Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Announcements Ticker */}
      {announcements.length > 0 && (
        <section className="py-4 bg-primary/10 border-y border-primary/20 overflow-hidden">
          <div className="flex animate-scroll-x">
            {[...announcements, ...announcements].map((announcement, index) => (
              <div key={`${announcement.id}-${index}`} className="flex items-center gap-8 px-8 whitespace-nowrap">
                <span className="font-rajdhani font-semibold text-primary">📢 {announcement.title}</span>
                <span className="text-muted-foreground">|</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 opacity-0 animate-fade-in-section">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Featured Events</span>
            </h2>
            <p className="font-rajdhani text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete in challenging events spanning coding, robotics, design, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-4 font-rajdhani font-bold text-lg
                neon-border rounded-xl text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Neon Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <GlassCard className="p-8 md:p-12 text-center max-w-4xl mx-auto glass-depth">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 neon-text">
              Ready to Innovate?
            </h2>
            <p className="font-rajdhani text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students from across India. Register now and be part of the biggest tech fest of 2026.
            </p>
            <Link 
              to="/events"
              className="group inline-flex items-center gap-2 px-10 py-4 font-rajdhani font-bold text-lg bg-primary text-primary-foreground 
                rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.5)]
                hover:scale-105 active:scale-95"
            >
              Start Your Journey
              <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
