import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, quickDemoLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      redirectByRole(res.user.role);
    } else {
      setError(res.error);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    const res = await quickDemoLogin(role);
    if (res.success) {
      redirectByRole(res.user.role);
    } else {
      setError(res.error);
    }
  };

  const redirectByRole = (role) => {
    if (role === 'INSTRUMENT_OWNER') navigate('/owner');
    else if (role === 'OFFICER') navigate('/officer');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '2.5rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="brand-emblem" style={{ margin: '0 auto 0.75rem', width: '50px', height: '50px', fontSize: '1.4rem' }}>
            LM
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
            Legal Metrology Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Sign in to verify and manage weighing & measuring instruments
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. owner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ margin: '1.75rem 0 1rem', position: 'relative', textAlign: 'center' }}>
          <hr style={{ borderColor: 'var(--border-color)' }} />
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              padding: '0 0.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Or 1-Click Demo Login
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleQuickDemo('INSTRUMENT_OWNER')}
            title="Login as ABC Stores (Shop Owner)"
          >
            👤 Owner
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleQuickDemo('OFFICER')}
            title="Login as Verification Officer"
          >
            🛡️ Officer
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleQuickDemo('ADMIN')}
            title="Login as System Administrator"
          >
            ⚙️ Admin
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          New business owner?{' '}
          <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
            Register your establishment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
