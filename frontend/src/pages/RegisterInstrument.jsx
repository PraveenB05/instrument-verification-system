import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axiosClient';
import { Scale, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const RegisterInstrument = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [instrumentNumber, setInstrumentNumber] = useState('');
  const [instrumentType, setInstrumentType] = useState('Digital Weighing Machine');
  const [customType, setCustomType] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredInst, setRegisteredInst] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const finalType = instrumentType === 'Other' ? customType : instrumentType;
    if (!finalType.trim()) {
      setError('Please specify the instrument type.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        instrumentNumber: instrumentNumber.trim().toUpperCase(),
        instrumentType: finalType.trim(),
        location: location.trim(),
        ownerId: user.id,
      };

      const res = await api.createInstrument(payload);
      setRegisteredInst(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to register instrument. Check if number is duplicate.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerificationNow = async () => {
    if (!registeredInst) return;
    try {
      setLoading(true);
      await api.submitVerification({ instrumentId: registeredInst.id });
      navigate('/owner');
    } catch (err) {
      setError(err.response?.data || 'Verification submission failed.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/owner" className="btn btn-outline btn-sm">
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="card-title">
          <Scale size={20} color="var(--primary-navy)" />
          <span>Register Weighing / Measuring Instrument</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Enter official instrument identification details. Once registered, you can submit an online verification request.
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {registeredInst ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              <CheckCircle2 size={54} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Instrument Registered Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Instrument <strong>{registeredInst.instrumentNumber}</strong> ({registeredInst.instrumentType}) is now registered.
              Would you like to submit an online verification request now?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                className="btn btn-success"
                onClick={handleRequestVerificationNow}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Request Verification Now'}
              </button>
              <Link to="/owner" className="btn btn-outline">
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Instrument Number / Serial No.</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. WM004"
                value={instrumentNumber}
                onChange={(e) => setInstrumentNumber(e.target.value)}
                required
              />
              <div className="form-helper">Must be unique for each instrument (e.g. WM001, WM002)</div>
            </div>

            <div className="form-group">
              <label className="form-label">Instrument Type</label>
              <select
                className="form-control"
                value={instrumentType}
                onChange={(e) => setInstrumentType(e.target.value)}
              >
                <option value="Digital Weighing Machine">Digital Weighing Machine</option>
                <option value="Electronic Weighing Scale">Electronic Weighing Scale</option>
                <option value="Industrial Platform Scale">Industrial Platform Scale</option>
                <option value="Precision Analytical Balance">Precision Analytical Balance</option>
                <option value="Fuel Dispensing Pump / Meter">Fuel Dispensing Pump / Meter</option>
                <option value="Other">Other (Specify below)</option>
              </select>
            </div>

            {instrumentType === 'Other' && (
              <div className="form-group">
                <label className="form-label">Specify Custom Instrument Type</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Commercial Beam Scale"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Physical Location / Shop Branch</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Salem, Main Bazaar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="form-helper">Location where the physical instrument is deployed</div>
            </div>

            <div className="form-group">
              <label className="form-label">Registered Owner / Establishment</label>
              <input
                type="text"
                className="form-control"
                value={user?.name || ''}
                disabled
                style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link to="/owner" className="btn btn-outline">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register Instrument'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterInstrument;
