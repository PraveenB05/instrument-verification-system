import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Shield, Scale, Clock, CheckCircle2, XCircle, Users, Award, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('instruments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminData();
      setAdminData(res.data);
    } catch (err) {
      setError('Failed to fetch admin system data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading Administrator Portal...</div>;
  }

  const stats = adminData?.stats || {};
  const instruments = adminData?.instruments || [];
  const verifications = adminData?.verifications || [];
  const certificates = adminData?.certificates || [];
  const users = adminData?.users || [];

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Legal Metrology Administration Portal</h1>
          <p className="page-subtitle">Central oversight of all registered instruments, inspection logs, and certificates</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Metrics Row */}
      <div className="stat-grid">
        <StatCard label="Total Instruments" value={stats.totalInstruments} icon={Scale} color="#006494" bgColor="#e8f1f5" />
        <StatCard label="Pending Requests" value={stats.pendingRequests} icon={Clock} color="#b45309" bgColor="#fffbeb" />
        <StatCard label="Verified Instruments" value={stats.verifiedInstruments} icon={CheckCircle2} color="#047857" bgColor="#ecfdf5" />
        <StatCard label="Rejected Requests" value={stats.rejectedRequests} icon={XCircle} color="#b91c1c" bgColor="#fef2f2" />
        <StatCard label="Certificates Issued" value={stats.totalCertificates} icon={Award} color="#b8860b" bgColor="#fef9c3" />
        <StatCard label="Registered Users" value={stats.totalUsers} icon={Users} color="#475569" bgColor="#f1f5f9" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn btn-sm ${activeTab === 'instruments' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('instruments')}
        >
          All Instruments ({instruments.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'verifications' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('verifications')}
        >
          Verification Logs ({verifications.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'certificates' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates ({certificates.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
      </div>

      {/* Tab 1: Instruments */}
      {activeTab === 'instruments' && (
        <div className="card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Instrument Number</th>
                  <th>Machine Type</th>
                  <th>Establishment (Owner)</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((inst) => (
                  <tr key={inst.id}>
                    <td><strong>{inst.instrumentNumber}</strong></td>
                    <td>{inst.instrumentType}</td>
                    <td>{inst.ownerName}</td>
                    <td>{inst.location}</td>
                    <td><StatusBadge status={inst.status} /></td>
                    <td>
                      {inst.certificateNumber ? (
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-blue)' }}>
                          {inst.certificateNumber}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Verifications */}
      {activeTab === 'verifications' && (
        <div className="card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Instrument</th>
                  <th>Establishment</th>
                  <th>Assigned Officer</th>
                  <th>Result</th>
                  <th>Remarks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td><strong>{v.instrumentNumber}</strong></td>
                    <td>{v.ownerName}</td>
                    <td>{v.officerName || 'Unassigned'}</td>
                    <td>{v.inspectionResult || 'Pending'}</td>
                    <td style={{ maxWidth: '280px', fontSize: '0.85rem' }}>{v.remarks || '—'}</td>
                    <td><StatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Certificates */}
      {activeTab === 'certificates' && (
        <div className="card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Certificate Number</th>
                  <th>Instrument</th>
                  <th>Owner</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--primary-navy)' }}>
                        {c.certificateNumber}
                      </strong>
                    </td>
                    <td>{c.instrumentNumber}</td>
                    <td>{c.ownerName}</td>
                    <td>{c.issueDate}</td>
                    <td>{c.expiryDate}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/certificate/${c.id}`} className="btn btn-sm btn-outline">
                        <ExternalLink size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className="user-role-tag">{u.role}</span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Setup'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
