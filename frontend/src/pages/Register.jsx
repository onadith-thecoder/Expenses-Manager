import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 transition-colors">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Create your account</h2>

        <label htmlFor="register-name" className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Name</label>
        <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />

        <label htmlFor="register-email" className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Email</label>
        <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />

        <label htmlFor="register-password" className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Password</label>
        <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />

        <label htmlFor="register-password-confirmation" className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Confirm Password</label>
        <input id="register-password-confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />

        <button type="submit" className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors">
          Register
        </button>

        {error && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</p>}

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;