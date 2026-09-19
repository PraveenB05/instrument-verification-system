import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axiosClient';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Search, ArrowRight } from 'lucide-react';

const PublicVerify = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();

  const [searchCert, setSearchCert] = useState(certificateNumber || '');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certificateNumber) {
      verifyCert(certificateNumber);
    } else {
      setLoading(false);
    }
  }, [certificateNumber]);

  const verifyCert = async (certNum) => {
    try {
      setLoading(true);
      const res = await api.verifyPublicCertificate(certNum.trim().toUpperCase());
      setCertData(res.data);
    } catch (err) {
      setCertData({
        valid: false,
        message: 'Unable to connect to verification server or certificate not found.',
        certificateNumber: certNum,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCert.trim()) {
      navigate(`/verify/${searchCert.trim().toUpperCase()}`);
    }
  };

  const getStatusType = () => {
    if (!certData) return 'none';
    if (!certData.valid && !certData.instrumentNumber) return 'invalid';
    if (certData.status === 'EXPIRED') return 'expired';
    if (certData.valid) return 'valid';
    return 'invalid';
  };

  const statusType = getStatusType();

  return (
    <div className="verify-container">
      {/* Search Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="brand-emblem" style={{ margin: '0 auto 0.75rem', width: '54px', height: '54px', fontSize: '1.5rem' }}>
          ⚖️
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
          Public Certificate Verification Portal
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Government of India &bull; National Legal Metrology Registry
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Certificate Number (e.g. LM-2026-0003)"
            value={searchCert}
            onChange={(e) => setSearchCert(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Search size={16} /> Verify
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
          Checking official metrology records...
        </div>
      ) : certData ? (
        <div className="verify-card">
          {/* Status Banner */}
          <div className={`verify-banner ${statusType}`}>
            {statusType === 'valid' && (
              <>
                <CheckCircle2 size={54} style={{ margin: '0 auto 0.5rem' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>✅ OFFICIALLY VERIFIED &amp; VALID</h2>
                <p style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '0.25rem' }}>
                  This weighing/measuring instrument has passed legal calibration inspection.
                </p>
              </>
            )}

            {statusType === 'expired' && (
              <>
                <AlertTriangle size={54} style={{ margin: '0 auto 0.5rem' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>⚠️ CERTIFICATE EXPIRED</h2>
                <p style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '0.25rem' }}>
                  This instrument certification has lapsed. Re-verification required.
                </p>
              </>
            )}

            {statusType === 'invalid' && (
              <>
                <XCircle size={54} style={{ margin: '0 auto 0.5rem' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>❌ CERTIFICATE NOT FOUND</h2>
                <p style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '0.25rem' }}>
                  No matching record exists in the official Legal Metrology registry.
                </p>
              </>
            )}
          </div>

          {/* Verification Details */}
          <div className="verify-body">
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Certificate Number</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--primary-navy)' }}>
                  {certData.certificateNumber || searchCert}
                </strong>
              </div>

              {certData.instrumentNumber && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Instrument ID</span>
                    <strong>{certData.instrumentNumber}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Equipment Type</span>
                    <strong>{certData.instrumentType}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Establishment (Owner)</span>
                    <strong>{certData.ownerName}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Verified Location</span>
                    <strong>{certData.location}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Issue Date</span>
                    <span>{certData.issueDate}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Expiry Date</span>
                    <strong style={{ color: statusType === 'valid' ? 'var(--success)' : 'var(--danger)' }}>
                      {certData.expiryDate}
                    </strong>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Verified securely via Department of Legal Metrology Digital Verification Infrastructure.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PublicVerify;
