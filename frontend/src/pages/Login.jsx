import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await login(email, password);
    
    if (res.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex items-center justify-center font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-green/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-accent/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none animate-pulse animation-delay-2000"></div>

      <div className="glass-dark p-10 rounded-3xl w-full max-w-md relative z-10 border border-gray-200 dark:border-white/10 shadow-2xl">
        <h2 className="text-4xl font-black mb-2 text-center text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-light">Sign in to manage your fantasy team</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="email">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all shadow-sm"
              placeholder="you@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest" htmlFor="password">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all shadow-sm"
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-green text-white dark:text-brand-dark font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-brand-green font-bold hover:underline">Register Here</Link>
        </p>
      </div>
    </div>
  );
}