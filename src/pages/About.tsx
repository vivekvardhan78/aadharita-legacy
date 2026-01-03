import { useEffect, useState } from 'react';
import { Target, Eye, Sparkles, Award, Users, Code, Lightbulb, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
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

  const team = [
    { name: 'Dr. Arun Sharma', role: 'Faculty Advisor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { name: 'Priya Mehta', role: 'General Secretary', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { name: 'Rahul Kumar', role: 'Technical Head', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
    { name: 'Sneha Reddy', role: 'Events Coordinator', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
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

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-orbitron text-3xl font-bold text-center mb-4">
            <span className="gradient-text">Meet the Team</span>
          </h2>
          <p className="font-rajdhani text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            The passionate individuals behind AADHRITA 2026.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <GlassCard
                key={member.name}
                hover
                className="p-6 text-center opacity-0 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden neon-border p-0.5">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-orbitron text-lg font-bold text-foreground">{member.name}</h3>
                <p className="font-rajdhani text-sm text-primary">{member.role}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
