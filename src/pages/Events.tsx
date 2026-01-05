import { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, Clock, HelpCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import GlassCard from '@/components/GlassCard';
import ParticleBackground from '@/components/ParticleBackground';
import { useEvents } from '@/hooks/useSupabaseData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Events = () => {
  const { events, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    return filtered;
  }, [events, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    return ['All', ...new Set(events.map((e) => e.category))];
  }, [events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
              <span className="gradient-text">Technical Events</span>
            </h1>
            <p className="font-rajdhani text-lg text-muted-foreground opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s' }}>
              Explore 50+ events across multiple domains. Find your arena and compete!
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-y border-border/30 bg-card/20 backdrop-blur-sm sticky top-28 md:top-32 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl font-rajdhani
                  focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Filter className="w-5 h-5 text-muted-foreground" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 font-rajdhani font-medium text-sm rounded-lg transition-all duration-300
                    ${selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                  <EventCard event={event} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-rajdhani text-xl text-muted-foreground">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}>
          <GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0" onClick={(e) => e.stopPropagation()}>
            {/* Accent Line */}
            <div 
              className="h-1 w-full rounded-t-2xl" 
              style={{ backgroundColor: selectedEvent.accent_color || '#00d4ff' }}
            />
            <div className="relative h-64 overflow-hidden">
              {/* Event Logo */}
              {selectedEvent.logo_url && (
                <div className="absolute top-4 left-4 z-10">
                  <img 
                    src={selectedEvent.logo_url} 
                    alt={`${selectedEvent.name} logo`}
                    className="h-16 w-16 object-contain bg-background/80 backdrop-blur-sm rounded-xl p-2"
                  />
                </div>
              )}
              {selectedEvent.poster_url && (
                <img
                  src={selectedEvent.poster_url}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 glass-card rounded-full hover:bg-destructive/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span 
                className="absolute bottom-4 left-6 px-4 py-1 text-sm font-rajdhani font-semibold 
                  backdrop-blur-sm text-white rounded-full"
                style={{ backgroundColor: `${selectedEvent.accent_color || '#00d4ff'}cc` }}
              >
                {selectedEvent.category}
              </span>
            </div>
            
            <div className="p-6 space-y-6">
              <h2 
                className="font-orbitron text-2xl font-bold"
                style={{ color: selectedEvent.accent_color || 'hsl(var(--primary))' }}
              >
                {selectedEvent.name}
              </h2>
              
              <p className="font-rajdhani text-muted-foreground">{selectedEvent.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1" style={{ color: selectedEvent.accent_color || undefined }} />
                  <div className="text-sm text-muted-foreground font-rajdhani">Date</div>
                  <div className="font-semibold" style={{ color: selectedEvent.accent_color || undefined }}>
                    {selectedEvent.date || 'TBA'}
                  </div>
                </div>
                <div className="glass-card p-4 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: selectedEvent.accent_color || undefined }} />
                  <div className="text-sm text-muted-foreground font-rajdhani">Time</div>
                  <div className="font-semibold" style={{ color: selectedEvent.accent_color || undefined }}>
                    {selectedEvent.time || 'TBA'}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {selectedEvent.faqs && selectedEvent.faqs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2" style={{ color: selectedEvent.accent_color || undefined }}>
                    <HelpCircle className="w-5 h-5" style={{ filter: `drop-shadow(0 0 8px ${selectedEvent.accent_color || '#00d4ff'})` }} />
                    Frequently Asked Questions
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {selectedEvent.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={`faq-${index}`}
                        className="glass-card border border-border/30 rounded-xl overflow-hidden"
                      >
                        <AccordionTrigger 
                          className="px-4 py-3 font-rajdhani font-semibold text-left hover:no-underline hover:bg-muted/20 transition-colors"
                          style={{ color: selectedEvent.accent_color || undefined }}
                        >
                          <span className="flex items-center gap-2">
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${selectedEvent.accent_color || '#00d4ff'}30`, color: selectedEvent.accent_color || undefined }}
                            >
                              {index + 1}
                            </span>
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="pl-8 font-rajdhani text-muted-foreground">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {selectedEvent.registration_url ? (
                <a 
                  href={selectedEvent.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 font-rajdhani font-bold text-lg text-white text-center
                    rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
                  style={{ backgroundColor: selectedEvent.accent_color || 'hsl(var(--primary))' }}
                >
                  Register for Event
                </a>
              ) : (
                <button 
                  className="w-full py-4 font-rajdhani font-bold text-lg text-white 
                    rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
                  style={{ backgroundColor: selectedEvent.accent_color || 'hsl(var(--primary))' }}
                >
                  Register for Event
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Events;
