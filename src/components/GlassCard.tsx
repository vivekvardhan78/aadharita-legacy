import { ReactNode, CSSProperties, MouseEventHandler } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const GlassCard = ({ children, className, hover = false, glow = false, style, onClick }: GlassCardProps) => {
  return (
    <div
      className={cn(
        hover ? 'glass-card-hover' : 'glass-card',
        glow && 'glow-effect',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
