/**
 * LoginPage — Authentication page with email/password, Google Sign-In, Forgot Password.
 *
 * Preserves the existing dual-pane visual style with gradient branding.
 * Adds social login and forgot password flow.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, Mail, ArrowRight, AlertCircle, Type, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

/** Google logo SVG */
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, forgotPassword } = useAuthStore();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email) { setError('Please enter your email address.'); return; }
      setLoading(true);
      const result = await forgotPassword(email);
      setLoading(false);
      if (result === true) {
        setSuccessMsg('Password reset email sent! Check your inbox.');
      } else {
        setError(result);
      }
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup') {
      if (!name) { setError('Name is required for registration.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    }

    setLoading(true);

    if (mode === 'signup') {
      const result = await register(email, password, name);
      if (result === true) {
        setSuccessMsg('Account created! Logging you in...');
        setTimeout(async () => {
          const loginResult = await login(email, password);
          if (loginResult === true) navigate('/');
          else setLoading(false);
        }, 800);
      } else {
        setError(result);
        setLoading(false);
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
      const result = await login(email, password);
      if (result === true) {
        navigate('/');
      } else {
        setError(result);
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle();
    if (result === true) {
      navigate('/');
    } else {
      setError(result);
    }
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden">

      {/* Left side — Branding */}
      <div className="relative hidden lg:flex flex-col flex-1 bg-gray-900 border-r border-gray-800 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/20">
              <LayoutDashboard className="h-5 w-5 text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">SystemCanvas</h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">architectures</span> at the speed of thought.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Drag, drop, and connect cloud infrastructure components. Collaborate in real-time with your team.
            </p>
          </div>

          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} SystemCanvas Inc.
          </div>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="flex flex-col justify-center flex-1 max-w-md w-full mx-auto p-8 relative z-10 overflow-y-auto">
        <div className="flex lg:hidden items-center gap-3 mb-12">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/20">
            <LayoutDashboard className="h-5 w-5 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold text-white">SystemCanvas</h1>
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back button for forgot password */}
          {mode === 'forgot' && (
            <button onClick={() => switchMode('login')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-6 transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Sign In
            </button>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'signup' ? 'Create an account' : mode === 'forgot' ? 'Reset password' : 'Welcome back'}
            </h2>
            <p className="text-sm text-gray-400">
              {mode === 'signup'
                ? 'Sign up to start designing cloud architectures.'
                : mode === 'forgot'
                  ? 'Enter your email and we\'ll send you a reset link.'
                  : 'Sign in to your account to continue designing.'}
            </p>
          </div>

          {/* Social login (login + signup only) */}
          {mode !== 'forgot' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 mb-4 rounded-lg font-medium text-sm bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700/80 hover:border-gray-600 active:bg-gray-800 transition-all disabled:opacity-50"
              >
                <GoogleIcon className="h-5 w-5" />
                Sign in with Google
              </button>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-xs text-gray-500 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Sign Up Only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Full Name</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Jane Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={mode === 'forgot' ? 'email' : 'text'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder={mode === 'login' ? 'you@example.com or admin' : 'you@example.com'}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password (login + signup) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => switchMode('forgot')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="••••••••"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password (Sign Up Only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error / Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{successMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 mt-6 rounded-lg font-medium text-sm transition-all ${
                loading ? 'bg-blue-600/50 text-blue-200 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
              }`}
            >
              {loading ? (
                <>{mode === 'signup' ? 'Creating account...' : mode === 'forgot' ? 'Sending...' : 'Signing in...'}</>
              ) : (
                <>
                  {mode === 'signup' ? 'Sign Up' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          {mode !== 'forgot' && (
            <div className="mt-6 text-center text-sm text-gray-500">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          )}

          {/* Demo hint */}
          {mode === 'login' && (
            <div className="mt-8 text-center text-xs text-gray-600">
              Demo mode: use <strong className="text-gray-400">admin</strong> / <strong className="text-gray-400">admin123</strong>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
