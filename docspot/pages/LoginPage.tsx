
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { APP_NAME, ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  // Determine the path to redirect to after login
  // `location.state?.from?.pathname` will contain the path the user was trying to access
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Pass the 'from' path to the login function
    const success = await login(email, password, from); 
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
    // Navigation is handled within useAuth's login method upon success,
    // considering the 'from' path if provided.
  };

  return (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full space-y-8"> {/* Adjusted: Removed flex classes, gap */}
        <div className="w-full"> {/* Adjusted: Simplified to w-full */}
            <Card title={`Sign in to ${APP_NAME}`} className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
                Let's Enter
                </Button>
            </form>
            <p className="mt-6 text-center text-sm text-brand-text-secondary">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="font-medium text-brand-primary hover:text-brand-primary-dark">
                Register here
                </Link>
            </p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
