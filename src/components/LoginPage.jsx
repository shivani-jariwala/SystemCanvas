import { useState } from 'react';
import { LayoutDashboard, Lock, User, ArrowRight, AlertCircle, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

function LoginPage() {
  const { login, register } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Shared fields
  const [username, setUsername] = useState('');
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
    
    if (!username || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError('Name is required for registration.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isSignUp) {
      const result = register(username, password, name);
      if (result === true) {
        setSuccessMsg('Account created successfully! Logging you in...');
        // Auto-login after successful registration
        setTimeout(() => {
          login(username, password);
        }, 1000);
      } else {
        setError(result); // Show error message (e.g. Username exists)
        setLoading(false);
      }
    } else {
      const result = login(username, password);
      if (result !== true) {
        setError(result);
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
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
              Drag, drop, and connect cloud infrastructure components. Export high-quality diagrams in seconds.
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
          key={isSignUp ? 'signup' : 'login'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-gray-400">
              {isSignUp 
                ? 'Sign up to start designing cloud architectures.' 
                : 'Sign in to your account to continue designing.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input (Sign Up Only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Full Name
                  </label>
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

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="johndoe"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                {!isSignUp && (
                  <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
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
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Confirm Password
                  </label>
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{successMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2
                py-2.5 mt-6 rounded-lg font-medium text-sm
                transition-all
                ${loading 
                  ? 'bg-blue-600/50 text-blue-200 cursor-wait' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
                }
              `}
            >
              {loading ? (
                <>{isSignUp ? 'Creating account...' : 'Signing in...'}</>
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
          
          {/* Demo hint */}
          {!isSignUp && (
            <div className="mt-8 text-center text-xs text-gray-600">
              For demo purposes, you can still use <strong className="text-gray-400">admin</strong> / <strong className="text-gray-400">admin123</strong>
            </div>
          )}
        </motion.div>
      </div>

    </div>
  );
}

export default LoginPage;
