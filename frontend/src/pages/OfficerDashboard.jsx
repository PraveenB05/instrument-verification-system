import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axiosClient';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { ShieldCheck, Clock, CheckCircle, XCircle, FileSearch, Award, AlertCircle } from 'lucide-react';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [inspectionResult, setInspectionResult] = useState('PASS');
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [approvedCertId, setApprovedCertId] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getPendingVerifications();
      setPendingRequests(res.data);
    } catch (err) {
      setError('Failed to fetch pending verification requests.');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (req) => {
    setSelectedRequest(req);
    setInspectionResult('PASS');
    setRemarks('Inspected and calibrated against certified secondary standard weights. Accuracy within permissible legal metrology limits.');
    setMessage('');
    setError('');
    setApprovedCertId(null);
  };

  const handleDecision = async (isApprove) => {
    if (!selectedRequest) return;
    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        officerId: user.id,
        inspectionResult: isApprove ? 'PASS' : 'FAIL',
        remarks: remarks.trim() || (isApprove ? 'Approved' : 'Rejected during physical inspection'),
      };

      if (isApprove) {
        await api.approveVerification(selectedRequest.id, payload);
        // Fetch generated certificate for this instrument
        const certRes = await api.getCertificateByInstrument(selectedRequest.instrumentId);
        setApprovedCertId(certRes.data.id);
        setMessage(`Verification APPROVED! Digital Certificate ${certRes.data.certificateNumber} generated with ZXing QR code.`);
      } else {
        await api.rejectVerification(selectedRequest.id, payload);
        setMessage(`Verification REJECTED for instrument ${selectedRequest.instrumentNumber}.`);
      }

      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data || 'Failed to process verification decision.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Officer Verification Portal</h1>
          <p className="page-subtitle">
            Authorized Legal Metrology Inspector: <strong>{user?.name}</strong>
          </p>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <div style={{ flex: 1 }}>{message}</div>
          {approvedCertId && (
            <button
              className="btn btn-sm btn-success"
              style={{ marginLeft: '1rem', border: '1px solid white' }}
              onClick={() => navigate(`/certificate/${approvedCertId}`)}
            >
              <Award size={14} /> View Issued Certificate
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="stat-grid">
        <StatCard
          label="Pending Inspection Queue"
          value={pendingRequests.length}
          icon={Clock}
          color="#b45309"
          bgColor="#fffbeb"
        />
        <StatCard
          label="Officer Role"
          value="Authorized"
          icon={ShieldCheck}
          color="#006494"
          bgColor="#e8f1f5"
        />
      </div>

      {/* Pending Requests Table */}
      <div className="card">
        <div className="card-title">
          <FileSearch size={20} color="var(--primary-navy)" />
          <span>Instruments Awaiting Verification ({pendingRequests.length})</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading pending inspection queue...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="empty-state">
            <CheckCircle className="empty-state-icon" style={{ color: '#10b981' }} />
            <p>Inspection queue is clear. No pending verification requests.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Instrument No.</th>
                  <th>Machine Type</th>
                  <th>Establishment (Owner)</th>
                  <th>Location</th>
                  <th>Request Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>#{req.id}</td>
                    <td>
                      <strong style={{ color: 'var(--primary-navy)' }}>{req.instrumentNumber}</strong>
                    </td>
                    <td>{req.instrumentType}</td>
                    <td>{req.ownerName}</td>
                    <td>{req.location}</td>
                    <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => openReviewModal(req)}
                      >
                        <ShieldCheck size={14} /> Review &amp; Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => {
          if (!actionLoading) setSelectedRequest(null);
        }}
        title={`Verification Inspection — Instrument ${selectedRequest?.instrumentNumber}`}
      >
        {selectedRequest && (
          <div>
            <div style={{ background: 'var(--light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.88rem' }}>
                <div><strong>Instrument No:</strong> {selectedRequest.instrumentNumber}</div>
                <div><strong>Type:</strong> {selectedRequest.instrumentType}</div>
                <div><strong>Owner:</strong> {selectedRequest.ownerName}</div>
                <div><strong>Location:</strong> {selectedRequest.location}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Inspection Result</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="inspection"
                    value="PASS"
                    checked={inspectionResult === 'PASS'}
                    onChange={() => setInspectionResult('PASS')}
                  />
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>PASS (Within Standard Tolerance)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="inspection"
                    value="FAIL"
                    checked={inspectionResult === 'FAIL'}
                    onChange={() => setInspectionResult('FAIL')}
                  />
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>FAIL (Calibration Discrepancy)</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Inspector Remarks / Test Observations</label>
              <textarea
                className="form-control"
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter standard weights tested, deviation margin, or reasons for failure..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedRequest(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDecision(false)}
                disabled={actionLoading}
              >
                <XCircle size={15} /> Reject
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleDecision(true)}
                disabled={actionLoading}
              >
                <CheckCircle size={15} /> {actionLoading ? 'Issuing...' : 'Approve & Issue Certificate'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OfficerDashboard;
