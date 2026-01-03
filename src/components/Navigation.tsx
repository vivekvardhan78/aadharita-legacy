import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/sponsors', label: 'Sponsors' },
  { path: '/team', label: 'Team' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/announcements', label: 'Announcements' },
  { path: '/about', label: 'About' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30 rounded-none">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-slow" />
            <span className="font-orbitron text-lg md:text-xl font-bold gradient-text">
              AADHRITA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 font-rajdhani font-medium text-sm tracking-wide transition-all duration-300 rounded-lg
                  ${location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Register Button - Desktop */}
          <div className="hidden lg:block">
            <button className="px-6 py-2 font-rajdhani font-semibold text-sm bg-primary text-primary-foreground rounded-lg
              transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] 
              hover:scale-105 active:scale-95">
              Register Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'}`}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 font-rajdhani font-medium rounded-lg transition-all duration-300
                  ${location.pathname === link.path
                    ? 'bg-primary/10 text-primary neon-border'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <button className="mt-2 px-4 py-3 font-rajdhani font-semibold bg-primary text-primary-foreground rounded-lg
              transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
