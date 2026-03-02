'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-bg" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80)',
        }} />
        <div className="auth-visual-content">
          <h2 className="auth-visual-title heading-display">Welcome Back</h2>
          <p className="auth-visual-text">
            Log in to manage your property listings and connect with potential buyers.
          </p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form animate-fade-in-up">
          <Link href="/" className="navbar-logo" style={{ marginBottom: '32px', display: 'inline-flex' }}>
            <div className="navbar-logo-icon">LE</div>
            Luxe Estates
          </Link>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Log In</h1>
            <p className="auth-form-subtitle">Access your account and listings</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-fields">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '24px' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="auth-form-footer">
            Don&apos;t have an account? <Link href="/auth/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
