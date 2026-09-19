import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, LogOut, User, CheckCircle, Clock, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isOwner, isOfficer, isAdmin, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitch = async (role) => {
    await quickDemoLogin(role);
    if (role === 'INSTRUMENT_OWNER') navigate('/owner');
    else if (role === 'OFFICER') navigate('/officer');
    else if (role === 'ADMIN') navigate('/admin');
  };

  return (
    <>
      {/* Top Demo Bar for quick viva switching */}
      <div className="demo-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Shield size={14} color="#f59e0b" />
          <span><strong>SIH26036 College Demo:</strong> Quick Role Switcher &rarr;</span>
        </div>
        <div className="demo-chips">
          <button className="demo-chip" onClick={() => handleQuickSwitch('INSTRUMENT_OWNER')}>
            Owner (ABC Stores)
          </button>
          <button className="demo-chip" onClick={() => handleQuickSwitch('OFFICER')}>
            Officer (Ramesh)
          </button>
          <button className="demo-chip" onClick={() => handleQuickSwitch('ADMIN')}>
            Admin Portal
          </button>
        </div>
      </div>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-brand">
            <div className="brand-emblem">LM</div>
            <div>
              <div className="brand-text-main">LEGAL METROLOGY</div>
              <div className="brand-text-sub">Verification Portal</div>
            </div>
          </Link>

          <div className="nav-links">
            {user ? (
              <>
                {isOwner && (
                  <>
                    <Link
                      to="/owner"
                      className={`nav-link ${location.pathname === '/owner' ? 'active' : ''}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/owner/register-instrument"
                      className={`nav-link ${location.pathname === '/owner/register-instrument' ? 'active' : ''}`}
                    >
                      + Register Instrument
                    </Link>
                  </>
                )}

                {isOfficer && (
                  <Link
                    to="/officer"
                    className={`nav-link ${location.pathname === '/officer' ? 'active' : ''}`}
                  >
                    Officer Review Queue
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  >
                    Admin Audit Portal
                  </Link>
                )}

                <div className="user-badge">
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                    <span className="user-role-tag">{user.role.replace('_', ' ')}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                    title="Sign Out"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-sm btn-outline" style={{ color: 'white' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-success">
                  Register Business
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
