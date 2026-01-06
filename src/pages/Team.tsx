import { Phone, User, GraduationCap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CollegeBrandingBar from '@/components/CollegeBrandingBar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import ParticleBackground from '@/components/ParticleBackground';
import { useTeam, type TeamMember } from '@/hooks/useSupabaseData';
import { processImageUrl, handleImageError } from '@/lib/imageUtils';

const Team = () => {
  const { data: team, loading } = useTeam();

  const studentCoordinators = team.filter(m => m.type === 'student');
  const facultyCoordinators = team.filter(m => m.type === 'faculty');

  const TeamCard = ({ member }: { member: TeamMember }) => (
    <GlassCard className="p-6 group hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.2)]">
      {/* Photo */}
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden 
        ring-2 ring-primary/30 group-hover:ring-primary transition-all duration-300">
        {member.photo_url ? (
          <img 
            src={processImageUrl(member.photo_url)} 
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => handleImageError(e, 'team')}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="font-orbitron text-lg font-bold text-foreground mb-1 group-hover:gradient-text transition-all">
          {member.name}
        </h3>
        
        <p className="font-rajdhani text-sm font-semibold text-primary mb-1">
          {member.role}
        </p>
        
        {member.department && (
          <p className="font-rajdhani text-xs text-muted-foreground mb-3">
            {member.department}
          </p>
        )}

        {/* Phone */}
        {member.phone && (
          <a 
            href={`tel:${member.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg 
              bg-primary/10 text-primary hover:bg-primary/20 transition-colors
              font-rajdhani text-sm"
          >
            <Phone className="w-4 h-4" />
            {member.phone}
          </a>
        )}
      </div>
    </GlassCard>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              <span className="gradient-text">Our Team</span>
            </h1>
            <p className="font-rajdhani text-lg text-muted-foreground">
              Meet the dedicated team behind AADHRITA 2026 working tirelessly to make this fest a grand success.
            </p>
          </div>
        </div>
      </section>

      {/* Student Coordinators */}
      {studentCoordinators.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground">
                Student Coordinators
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {studentCoordinators.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Faculty Coordinators */}
      {facultyCoordinators.length > 0 && (
        <section className="py-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="p-2 rounded-lg bg-gradient-to-r from-secondary to-accent">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground">
                Faculty Coordinators
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {facultyCoordinators.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {team.length === 0 && (
        <section className="py-20">
          <div className="text-center">
            <p className="font-rajdhani text-xl text-muted-foreground">
              Team information coming soon!
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Team;
