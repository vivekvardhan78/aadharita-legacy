import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getAadhritaBranding, type AadhritaBranding } from '@/lib/storage';

interface AadhritaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const AadhritaLogo = ({ size = 'md', showText = true, className = '' }: AadhritaLogoProps) => {
  const [branding, setBranding] = useState<AadhritaBranding | null>(null);

  useEffect(() => {
    setBranding(getAadhritaBranding());
  }, []);

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

  const glowColor = branding?.glowColor || '#ef4444';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {branding?.logoUrl ? (
        <div
          className="relative animate-pulse-slow"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 30px ${glowColor}40)`,
          }}
        >
          <img
            src={branding.logoUrl}
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
          AADHRITA
        </span>
      )}
    </div>
  );
};

export default AadhritaLogo;
