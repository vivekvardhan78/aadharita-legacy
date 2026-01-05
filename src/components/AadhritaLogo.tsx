import { Sparkles } from 'lucide-react';
import { useBranding } from '@/hooks/useSupabaseData';

interface AadhritaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const AadhritaLogo = ({ size = 'md', showText = true, className = '' }: AadhritaLogoProps) => {
  const { branding } = useBranding();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const glowColor = branding?.glow_color || '#ef4444';
  const logoUrl = branding?.hero_logo || branding?.logo_url;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {logoUrl ? (
        <div
          className="relative animate-pulse-slow"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 30px ${glowColor}40)`,
          }}
        >
          <img
            src={logoUrl}
            alt="AADHRITA Logo"
            className={`${sizeClasses[size]} object-contain`}
          />
        </div>
      ) : (
        <div
          className="animate-pulse-slow"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor})`,
          }}
        >
          <Sparkles
            className={sizeClasses[size]}
            style={{ color: glowColor }}
          />
        </div>
      )}
      {showText && (
        <span
          className={`font-orbitron ${textSizeClasses[size]} font-bold`}
          style={{
            color: glowColor,
            textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}40`,
          }}
        >
          {branding?.fest_name || 'AADHRITA'}
        </span>
      )}
    </div>
  );
};

export default AadhritaLogo;
