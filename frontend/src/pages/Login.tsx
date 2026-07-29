import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'login' ? signIn : signUp;
    const { error: err } = await fn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else if (mode === 'signup') {
      // After signup, Supabase auto-signs in (email confirmation off)
      navigate('/app');
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-ink-950 to-ink-950" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">RiskIntel</h1>
              <p className="text-xs text-ink-400">Property Risk Intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Know your property's
              <br />
              <span className="text-brand-400">weather risk</span> before it happens.
            </h2>
            <p className="text-ink-400 text-lg leading-relaxed max-w-md">
              Enterprise-grade intelligence combining live weather, historical storm data,
              flood analysis, and AI predictions — all in one platform.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 max-w-md">
              {[
                ['30+', 'Weather data sources'],
                ['1.2M', 'Storms analyzed'],
                ['50yr', 'Historical coverage'],
                ['AI', 'Risk predictions'],
              ].map(([stat, label]) => (
                <div key={label} className="border-l-2 border-brand-500/50 pl-4">
                  <div className="text-2xl font-bold text-white">{stat}</div>
                  <div className="text-sm text-ink-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink-600">
            © 2025 RiskIntel Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-ink-50">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ink-900">RiskIntel</span>
          </div>

          <h2 className="text-2xl font-bold text-ink-900 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-ink-500 mb-8">
            {mode === 'login'
              ? 'Sign in to access your risk intelligence dashboard.'
              : 'Start analyzing property risk in minutes.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
