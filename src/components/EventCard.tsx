import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/storage';
import GlassCard from './GlassCard';

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const accentColor = event.accentColor || '#00d4ff';

  return (
    <GlassCard
      hover
      className="group overflow-hidden opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
    >
      {/* Accent Line */}
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: accentColor }}
      />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {/* Event Logo Overlay */}
        {event.logoUrl && (
          <div className="absolute top-4 left-4 z-10">
            <img 
              src={event.logoUrl} 
              alt={`${event.name} logo`}
              className="h-12 w-12 object-contain bg-background/80 backdrop-blur-sm rounded-lg p-1"
            />
          </div>
        )}
        <img
          src={event.posterUrl}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <span 
          className="absolute top-4 right-4 px-3 py-1 text-xs font-rajdhani font-semibold 
            backdrop-blur-sm text-white rounded-full"
          style={{ backgroundColor: `${accentColor}cc` }}
        >
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 
          className="font-orbitron text-xl font-bold text-foreground transition-colors"
          style={{ '--hover-color': accentColor } as React.CSSProperties}
        >
          <span className="group-hover:text-[var(--hover-color)]" style={{ color: 'inherit' }}>
            {event.name}
          </span>
        </h3>
        
        <p className="text-muted-foreground font-rajdhani line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground font-rajdhani">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" style={{ color: accentColor }} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" style={{ color: accentColor }} />
            <span>{event.time}</span>
          </div>
        </div>

        <button 
          className="flex items-center gap-2 font-rajdhani font-semibold 
            group-hover:gap-3 transition-all duration-300"
          style={{ color: accentColor }}
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
};

export default EventCard;
