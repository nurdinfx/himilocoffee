import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center"
        style={{ backgroundImage: `url('/auth-bg.png')` }}
      />
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm" />

      {/* Glassmorphic Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full z-20 space-y-8 bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] shadow-2xl border border-white/20"
      >
        <div className="text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-primary-600/20 backdrop-blur-md rounded-3xl mb-6 border border-primary-500/30"
            >
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/50">
                    <span className="text-white font-black text-2xl">H</span>
                </div>
            </motion.div>
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-white tracking-tight"
            >
                Create <span className="text-primary-400">Account</span>
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 text-sm text-gray-300 font-medium"
            >
                Join our coffee-loving community today.
            </motion.p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-100 p-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    {error}
                </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-400 transition-colors">
                    <User size={18} />
                </div>
                <input 
                    type="text" 
                    required 
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-400 transition-colors">
                    <Mail size={18} />
                </div>
                <input 
                    type="email" 
                    required 
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none" 
                    placeholder="Email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="relative group"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-400 transition-colors">
                    <Lock size={18} />
                </div>
                <input 
                    type="password" 
                    required 
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-4 px-4 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white text-sm font-black rounded-2xl transition-all shadow-xl shadow-primary-600/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
              ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
              )}
            </button>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center text-sm text-gray-400"
          >
            Already have an account? <Link to="/login" className="font-black text-primary-400 hover:text-primary-300 transition-colors">Sign in</Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
