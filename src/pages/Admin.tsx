import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { adminLogin, isAdminAuthenticated } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/panel');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (adminLogin(password)) {
        toast({
          title: 'Welcome, Admin!',
          description: 'You have successfully logged in.',
        });
        navigate('/panel');
      } else {
        toast({
          title: 'Access Denied',
          description: 'Invalid password. Please try again.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" 
        style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <GlassCard className="w-full max-w-md p-8 relative z-10 opacity-0 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 
            flex items-center justify-center neon-border animate-glow">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-orbitron text-2xl font-bold gradient-text mb-2">Admin Portal</h1>
          <p className="font-rajdhani text-muted-foreground">Enter your password to access the CMS panel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-4 bg-muted/50 border border-border rounded-xl font-rajdhani
                focus:outline-none focus:border-primary transition-colors pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 font-rajdhani font-bold text-lg bg-primary text-primary-foreground 
              rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Access Panel
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 font-rajdhani text-sm text-muted-foreground">
          Hint: aadhrita2026admin
        </p>
      </GlassCard>
    </div>
  );
};

export default Admin;
