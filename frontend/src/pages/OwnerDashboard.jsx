import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axiosClient';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Scale, Clock, CheckCircle2, XCircle, Plus, Award, AlertCircle } from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchInstruments();
  }, [user]);

  const fetchInstruments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getInstruments(user.id);
      setInstruments(res.data);
    } catch (err) {
      setError('Failed to fetch instruments.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async (instrumentId) => {
    try {
      setSubmittingId(instrumentId);
      setMessage('');
      setError('');
      await api.submitVerification({ instrumentId });
      setMessage('Verification request submitted successfully! An officer will inspect the instrument.');
      fetchInstruments();
    } catch (err) {
      setError(err.response?.data || 'Failed to submit verification request.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleViewCertificate = async (instrumentId) => {
    try {
      const res = await api.getCertificateByInstrument(instrumentId);
      navigate(`/certificate/${res.data.id}`);
    } catch (err) {
      setError('Certificate is not yet issued or could not be loaded.');
    }
  };

  // Stats calculation
  const totalCount = instruments.length;
  const pendingCount = instruments.filter(i => i.status === 'PENDING_VERIFICATION').length;
  const verifiedCount = instruments.filter(i => i.status === 'VERIFIED').length;
  const rejectedCount = instruments.filter(i => i.status === 'REJECTED').length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Establishment Dashboard</h1>
          <p className="page-subtitle">
            Manage weighing & measuring instruments for <strong>{user?.name}</strong>
          </p>
        </div>
        <Link to="/owner/register-instrument" className="btn btn-primary">
          <Plus size={16} /> Register New Instrument
        </Link>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="stat-grid">
        <StatCard label="My Instruments" value={totalCount} icon={Scale} color="#006494" bgColor="#e8f1f5" />
        <StatCard label="Pending Verification" value={pendingCount} icon={Clock} color="#b45309" bgColor="#fffbeb" />
        <StatCard label="Verified & Certified" value={verifiedCount} icon={CheckCircle2} color="#047857" bgColor="#ecfdf5" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} color="#b91c1c" bgColor="#fef2f2" />
      </div>

      {/* Instruments Table Card */}
      <div className="card">
        <div className="card-title">
          <Scale size={20} color="var(--primary-navy)" />
          <span>Registered Instruments</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading instruments...</div>
        ) : instruments.length === 0 ? (
          <div className="empty-state">
            <Scale className="empty-state-icon" />
            <p>No weighing or measuring instruments registered yet.</p>
            <Link to="/owner/register-instrument" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
              Register your first machine
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Instrument Number</th>
                  <th>Machine Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Certificate</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((inst) => (
                  <tr key={inst.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-navy)' }}>{inst.instrumentNumber}</strong>
                    </td>
                    <td>{inst.instrumentType}</td>
                    <td>{inst.location}</td>
                    <td>
                      <StatusBadge status={inst.status} />
                    </td>
                    <td>
                      {inst.certificateNumber ? (
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-blue)' }}>
                          {inst.certificateNumber}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {inst.status === 'REGISTERED' && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleRequestVerification(inst.id)}
                          disabled={submittingId === inst.id}
                        >
                          {submittingId === inst.id ? 'Submitting...' : 'Request Verification'}
                        </button>
                      )}

                      {inst.status === 'PENDING_VERIFICATION' && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--warning)', fontWeight: 600 }}>
                          Awaiting Inspection
                        </span>
                      )}

                      {inst.status === 'VERIFIED' && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleViewCertificate(inst.id)}
                        >
                          <Award size={14} /> View Certificate
                        </button>
                      )}

                      {inst.status === 'REJECTED' && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleRequestVerification(inst.id)}
                          disabled={submittingId === inst.id}
                          title="Re-apply after rectification"
                        >
                          Re-apply
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
