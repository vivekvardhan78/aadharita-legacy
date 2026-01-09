import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import AadhritaLogo from './AadhritaLogo';

const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <AadhritaLogo size="md" showText={true} />
            <p className="text-muted-foreground font-rajdhani">
              India's premier national-level technical fest. Where innovation meets excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-orbitron text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-2 font-rajdhani">
              <li><Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">Events</Link></li>
              <li><Link to="/gallery" className="text-muted-foreground hover:text-foreground transition-colors">Gallery</Link></li>
              <li><Link to="/announcements" className="text-muted-foreground hover:text-foreground transition-colors">Announcements</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Events */}
          <div className="space-y-4">
            <h3 className="font-orbitron text-lg font-semibold text-primary">Featured Events</h3>
            <ul className="space-y-2 font-rajdhani">
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">CodeStorm Hackathon</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">RoboWars</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">TechQuiz</span></li>
              <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">AI Summit</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-orbitron text-lg font-semibold text-primary">Contact Us</h3>
            <ul className="space-y-3 font-rajdhani">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Maharaj Vijayram Gajapathi Raj College of Engineering, Vizianagaram, Andhra pradesh, India</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@aadhrita2026.tech</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-rajdhani">
              © 2026 AADHRITA. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-rajdhani">
              <Link to="/admin" className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                
              </Link>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
