import { Calendar, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';
import { processImageUrl, handleImageError } from '@/lib/imageUtils';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    category: string;
    date?: string | null;
    time?: string | null;
    description?: string | null;
    poster_url?: string | null;
    logo_url?: string | null;
    accent_color?: string | null;
    registration_url?: string | null;
  };
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const accentColor = event.accent_color || '#00f0ff';
  const posterUrl = processImageUrl(event.poster_url);
  const logoUrl = processImageUrl(event.logo_url);

  return (
    <GlassCard
      hover
      className="group overflow-hidden opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
    >
      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />
      
      <div className="relative h-48 overflow-hidden">
        {logoUrl && (
          <div className="absolute top-3 left-3 z-10">
            <img 
              src={logoUrl} 
              alt={`${event.name} logo`} 
              className="h-10 w-10 object-contain bg-background/80 backdrop-blur-sm rounded-lg p-1"
              onError={(e) => handleImageError(e, 'logo')}
              loading="lazy"
            />
          </div>
        )}
        
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={event.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => handleImageError(e, 'event')}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="font-orbitron text-2xl font-bold text-muted-foreground/50">{event.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-rajdhani font-semibold backdrop-blur-sm text-white rounded-full" style={{ backgroundColor: `${accentColor}cc` }}>
          {event.category}
        </span>

        {event.date && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg text-xs font-rajdhani">
            <Calendar className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>{event.date}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-orbitron text-lg font-bold mb-2 group-hover:text-primary transition-colors" style={{ color: accentColor }}>
          {event.name}
        </h3>
        <p className="font-rajdhani text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description || 'Event details coming soon...'}
        </p>

        {event.registration_url ? (
          <a href={event.registration_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 px-4 py-2 font-rajdhani font-semibold text-sm text-white rounded-lg transition-all duration-300 hover:scale-105 animate-pulse-slow"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${accentColor}40` }}>
            REGISTER NOW <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <button className="px-4 py-2 font-rajdhani font-semibold text-sm rounded-lg" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            Coming Soon
          </button>
        )}
      </div>
    </GlassCard>
  );
};

export default EventCard;
