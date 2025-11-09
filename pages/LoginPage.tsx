
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Logo from '../components/common/Logo';
import Spinner from '../components/common/Spinner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user && submitted) {
        let destination = '/';
        switch (user.role) {
            case UserRole.USER: destination = '/dashboard'; break;
            case UserRole.PARTNER: destination = '/partner'; break;
            case UserRole.MERCHANT: destination = '/merchant'; break;
            case UserRole.ADMIN: destination = '/admin'; break;
        }
        navigate('/2fa', { state: { destination } });
    }
  }, [user, submitted, navigate]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="text-5xl" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">Global Payments, Simplified.</p>
        </div>
        
        <div className="bg-white dark:bg-primary-light border border-gray-200 dark:border-primary rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Welcome Back</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                I am a...
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 block w-full bg-gray-100 dark:bg-primary border border-gray-300 dark:border-primary-light rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
              >
                <option value={UserRole.USER}>User (Business/Freelancer)</option>
                <option value={UserRole.PARTNER}>Financial Partner</option>
                <option value={UserRole.MERCHANT}>Merchant</option>
                <option value={UserRole.ADMIN}>Super Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-100 dark:bg-primary border border-gray-300 dark:border-primary-light rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-100 dark:bg-primary border border-gray-300 dark:border-primary-light rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-primary bg-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-primary-light disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Spinner className="w-5 h-5 text-primary" /> : 'Log In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
                Don't have an account?{' '}
                <a onClick={() => navigate('/onboarding')} className="font-medium text-accent hover:opacity-80 cursor-pointer">
                Sign up
                </a>
            </p>
            <a onClick={() => navigate('/')} className="font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
              &larr; Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;