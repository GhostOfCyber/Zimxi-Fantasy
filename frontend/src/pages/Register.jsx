import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', { name, teamName, email, password });
      toast.success('Registration successful!');
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex items-center justify-center font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-gold/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none animate-pulse animation-delay-4000"></div>

      <div className="glass-dark p-10 rounded-3xl w-full max-w-md relative z-10 border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-transparent">
        <h2 className="text-4xl font-black mb-8 text-center text-gray-900 dark:text-white tracking-tight">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" value={name} onChange={e=>setName(e.target.value)} 
              className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
              placeholder="John Doe" required 
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest">Team Name</label>
            <input 
              type="text" value={teamName} onChange={e=>setTeamName(e.target.value)} 
              className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
              placeholder="FC Fantasy" required 
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" value={email} onChange={e=>setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
              placeholder="you@example.com" required 
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" value={password} onChange={e=>setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-sm"
              placeholder="••••••••" required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-gold text-white dark:text-brand-dark font-black py-4 rounded-xl mt-4 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-brand-gold font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}