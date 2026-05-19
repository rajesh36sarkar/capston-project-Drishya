import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaArrowRight } from 'react-icons/fa';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.username || formData.username.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await register(formData.username, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-pink-600/10 dark:bg-pink-600/15 rounded-full blur-[80px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 180 }}
        className="w-full max-w-md bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.3)] z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-14 h-14 mx-auto bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20"
          >
            <span className="text-white font-black text-xl tracking-wide">D</span>
          </motion.div>
          
          <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-1.5">
            {isLogin ? 'Sign in to access your synchronized streaming feed.' : 'Register a free profile to begin creating streams.'}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative group w-full"
              >
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors text-sm" />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 text-xs md:text-sm bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-purple-500/10 text-[var(--text-primary)] transition-all font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group w-full">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors text-sm" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 text-xs md:text-sm bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-purple-500/10 text-[var(--text-primary)] transition-all font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              required
            />
          </div>

          <div className="relative group w-full">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors text-sm" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-11 pr-4 py-3 text-xs md:text-sm bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-purple-500/10 text-[var(--text-primary)] transition-all font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-xs tracking-wide shadow-md shadow-purple-600/10 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 hover:opacity-95 transition-opacity"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <FaArrowRight className="text-[10px]" />
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-6 select-none pointer-events-none">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-zinc-800/80"></div>
          </div>
          <div className="relative flex justify-center text-[10px] tracking-widest font-bold uppercase">
            <span className="px-3 bg-white dark:bg-[#121212] text-zinc-400 dark:text-zinc-500">Or credentials connection</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-zinc-900 active:scale-95 transition-all flex items-center justify-center gap-2">
            <FaGoogle className="text-amber-500" /> Google
          </button>
          <button className="flex-1 py-2.5 border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-zinc-900 active:scale-95 transition-all flex items-center justify-center gap-2">
            <FaGithub className="text-[var(--text-primary)]" /> GitHub
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-[var(--text-muted)] font-semibold">
          {isLogin ? "Don't have an active creator profile? " : "Already established an account? "}
          <button
            type="button"
            onClick={() => { setError(''); setIsLogin(!isLogin); }}
            className="text-purple-500 hover:text-purple-600 transition-colors font-bold ml-1 hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;