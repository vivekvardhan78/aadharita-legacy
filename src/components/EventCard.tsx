import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/storage';
import GlassCard from './GlassCard';

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  return (
    <GlassCard
      hover
      className="group overflow-hidden opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.posterUrl}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-rajdhani font-semibold bg-secondary/80 
          backdrop-blur-sm text-secondary-foreground rounded-full">
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="font-orbitron text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        
        <p className="text-muted-foreground font-rajdhani line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground font-rajdhani">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span>{event.time}</span>
          </div>
        </div>

        <button className="flex items-center gap-2 text-primary font-rajdhani font-semibold 
          group-hover:gap-3 transition-all duration-300">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
};

export default EventCard;
