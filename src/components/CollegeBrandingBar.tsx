import { useEffect, useState } from 'react';
import { MapPin, GraduationCap } from 'lucide-react';
import { getCollegeBranding, type CollegeBranding } from '@/lib/storage';

const CollegeBrandingBar = () => {
  const [branding, setBranding] = useState<CollegeBranding | null>(null);

  useEffect(() => {
    setBranding(getCollegeBranding());
  }, []);

  if (!branding) return null;

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 glass-card border-b border-border/20 rounded-none">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* College Logo */}
          {branding.logoUrl ? (
            <img 
              src={branding.logoUrl} 
              alt={branding.collegeName}
              className="h-8 md:h-10 w-auto object-contain"
            />
          ) : (
            <div className="h-8 md:h-10 w-8 md:w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          )}

          {/* College Info */}
          <div className="text-center md:text-left">
            <h2 className="font-orbitron text-xs md:text-sm font-bold text-foreground leading-tight">
              {branding.collegeName}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="font-rajdhani text-xs">{branding.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeBrandingBar;
