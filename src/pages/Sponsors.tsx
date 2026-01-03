import { useEffect, useState } from 'react';
import { ExternalLink, Award, Star, Medal, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import ParticleBackground from '@/components/ParticleBackground';
import { getSponsors, initializeStorage, type Sponsor } from '@/lib/storage';

const categoryConfig = {
  Title: { icon: Award, color: 'from-yellow-400 to-amber-600', glow: 'shadow-yellow-500/30' },
  Gold: { icon: Star, color: 'from-yellow-300 to-yellow-500', glow: 'shadow-yellow-400/20' },
  Silver: { icon: Medal, color: 'from-slate-300 to-slate-500', glow: 'shadow-slate-400/20' },
  Supporter: { icon: Heart, color: 'from-rose-400 to-pink-500', glow: 'shadow-rose-400/20' },
};

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    initializeStorage();
    setSponsors(getSponsors());
  }, []);

  const groupedSponsors = {
    Title: sponsors.filter(s => s.category === 'Title'),
    Gold: sponsors.filter(s => s.category === 'Gold'),
    Silver: sponsors.filter(s => s.category === 'Silver'),
    Supporter: sponsors.filter(s => s.category === 'Supporter'),
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navigation />
      <CollegeBrandingBar />

      {/* Hero Section */}
      <section className="pt-40 pb-12 relative">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Our Sponsors</span>
            </h1>
            <p className="font-rajdhani text-lg text-muted-foreground">
              We are proud to partner with industry leaders who share our vision of fostering innovation and technical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          {Object.entries(groupedSponsors).map(([category, categorySponsors]) => {
            if (categorySponsors.length === 0) return null;
            const config = categoryConfig[category as keyof typeof categoryConfig];
            const Icon = config.icon;

            return (
              <div key={category} className="mb-16">
                {/* Category Header */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground">
                    {category} {category === 'Title' ? 'Sponsor' : 'Sponsors'}
                  </h2>
                </div>

                {/* Sponsors Cards */}
                <div className={`grid gap-6 ${
                  category === 'Title' ? 'grid-cols-1 max-w-md mx-auto' :
                  category === 'Gold' ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
                  'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {categorySponsors.map((sponsor) => (
                    <GlassCard 
                      key={sponsor.id} 
                      className={`p-6 group hover:scale-105 transition-all duration-300 
                        hover:shadow-xl ${config.glow}`}
                    >
                      <div className="text-center">
                        {/* Logo */}
                        <div className={`aspect-square w-full max-w-[${category === 'Title' ? '200px' : '150px'}] 
                          mx-auto mb-4 rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center`}>
                          {sponsor.logoUrl ? (
                            <img 
                              src={sponsor.logoUrl} 
                              alt={sponsor.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="font-orbitron text-lg font-bold text-foreground mb-2">
                          {sponsor.name}
                        </h3>

                        {/* Category Badge */}
                        <span className={`inline-block px-3 py-1 text-xs font-rajdhani font-semibold rounded-full
                          bg-gradient-to-r ${config.color} text-white mb-4`}>
                          {sponsor.category}
                        </span>

                        {/* Website Link */}
                        {sponsor.websiteUrl && (
                          <a 
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-sm font-rajdhani text-primary 
                              hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          })}

          {sponsors.length === 0 && (
            <div className="text-center py-20">
              <p className="font-rajdhani text-xl text-muted-foreground">
                Sponsor information coming soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <GlassCard className="p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-4 neon-text">
              Become a Sponsor
            </h2>
            <p className="font-rajdhani text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Partner with AADHRITA 2026 and reach thousands of talented students from across India. 
              Contact us for sponsorship opportunities.
            </p>
            <button className="px-8 py-3 font-rajdhani font-bold bg-primary text-primary-foreground 
              rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]
              hover:scale-105 active:scale-95">
              Contact Us
            </button>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsors;
