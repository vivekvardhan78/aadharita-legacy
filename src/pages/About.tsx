import { useEffect, useState } from 'react';
import { Target, Eye, Sparkles, Award, Lightbulb, Users, Code, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import ParticleBackground from '@/components/ParticleBackground';
import { getSettings, initializeStorage } from '@/lib/storage';
import type { AboutContent } from '@/lib/storage';

const About = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    initializeStorage();
    const settings = getSettings();
    setAboutContent(settings.aboutContent);
  }, []);

  if (!aboutContent) return null;

  const values = [
    { icon: Lightbulb, title: 'Innovation', description: 'Pushing boundaries and exploring new frontiers in technology.' },
    { icon: Users, title: 'Collaboration', description: 'Bringing together brilliant minds from across the nation.' },
    { icon: Code, title: 'Excellence', description: 'Striving for the highest standards in every event.' },
    { icon: Heart, title: 'Passion', description: 'Fueled by love for technology and learning.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navigation />
      <CollegeBrandingBar />

      {/* Hero */}
      <section className="pt-44 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse-slow" />
            </div>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
              <span className="gradient-text">About AADHRITA</span>
            </h1>
            <p className="font-rajdhani text-lg text-muted-foreground opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s' }}>
              {aboutContent.description}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {aboutContent.highlights.map((highlight, index) => (
              <GlassCard
                key={index}
                className="p-6 text-center opacity-0 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <Award className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="font-rajdhani font-semibold text-foreground">{highlight}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <GlassCard className="p-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-orbitron text-2xl font-bold neon-text">Our Mission</h2>
              </div>
              <p className="font-rajdhani text-muted-foreground leading-relaxed">
                {aboutContent.mission}
              </p>
            </GlassCard>

            <GlassCard className="p-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="font-orbitron text-2xl font-bold neon-text-purple">Our Vision</h2>
              </div>
              <p className="font-rajdhani text-muted-foreground leading-relaxed">
                {aboutContent.vision}
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <h2 className="font-orbitron text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Our Values</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <GlassCard
                key={value.title}
                hover
                className="p-6 text-center opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 
                  flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-orbitron text-lg font-bold mb-2 text-foreground">{value.title}</h3>
                <p className="font-rajdhani text-sm text-muted-foreground">{value.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <GlassCard className="p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-4 neon-text">
              Meet Our Team
            </h2>
            <p className="font-rajdhani text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
              Get to know the passionate individuals working tirelessly to make AADHRITA 2026 a grand success.
            </p>
            <Link 
              to="/team"
              className="inline-block px-8 py-3 font-rajdhani font-bold bg-primary text-primary-foreground 
                rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]
                hover:scale-105 active:scale-95"
            >
              View Team
            </Link>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
