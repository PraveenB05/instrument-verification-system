import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/axiosClient';
import StatusBadge from '../components/StatusBadge';
import { Download, Printer, ArrowLeft, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';

const CertificateView = () => {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const res = await api.getCertificateById(id);
      setCert(res.data);
    } catch (err) {
      setError('Certificate not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(api.downloadCertificatePdfUrl(id), '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading Certificate...</div>;
  }

  if (error || !cert) {
    return (
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 1rem' }}>
        <div className="alert alert-error">{error || 'Certificate not found.'}</div>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      {/* Top Action Controls (hidden during print) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }} className="no-print">
        <button onClick={() => window.history.back()} className="btn btn-outline btn-sm">
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <Printer size={15} /> Print Certificate
          </button>
          <button onClick={handleDownloadPdf} className="btn btn-primary btn-sm">
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Document */}
      <div className="cert-document">
        <div className="cert-header">
          <div className="cert-emblem">⚖️</div>
          <div className="cert-country">GOVERNMENT OF INDIA</div>
          <div className="cert-dept">Department of Legal Metrology (Weights &amp; Measures)</div>
          <div className="cert-doc-name">CERTIFICATE OF VERIFICATION</div>
        </div>

        <div className="cert-meta-bar">
          Certificate Number: {cert.certificateNumber}
        </div>

        <div className="cert-grid">
          <div className="cert-field">
            <div className="cert-field-label">Instrument Number</div>
            <div className="cert-field-value">{cert.instrumentNumber}</div>
          </div>
          <div className="cert-field">
            <div className="cert-field-label">Instrument Type</div>
            <div className="cert-field-value">{cert.instrumentType}</div>
          </div>
          <div className="cert-field">
            <div className="cert-field-label">Establishment / Owner</div>
            <div className="cert-field-value">{cert.ownerName}</div>
          </div>
          <div className="cert-field">
            <div className="cert-field-label">Physical Location</div>
            <div className="cert-field-value">{cert.location}</div>
          </div>
          <div className="cert-field">
            <div className="cert-field-label">Date of Issue / Calibration</div>
            <div className="cert-field-value">{cert.issueDate}</div>
          </div>
          <div className="cert-field">
            <div className="cert-field-label">Certificate Valid Until</div>
            <div className="cert-field-value" style={{ color: 'var(--primary-navy)' }}>
              {cert.expiryDate}
            </div>
          </div>
          <div className="cert-field" style={{ gridColumn: 'span 2' }}>
            <div className="cert-field-label">Certification Status</div>
            <div style={{ marginTop: '0.25rem' }}>
              <StatusBadge status={cert.status} />
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--primary-navy)' }}>
          This is to certify that the weighing / measuring instrument identified above has been duly inspected, tested, and verified in conformity with the Standards of Weights and Measures and Legal Metrology Regulations. The instrument is approved for commercial transactions.
        </div>

        <div className="cert-footer-row">
          <div className="cert-qr-box">
            {cert.qrCodeData ? (
              <img
                src={cert.qrCodeData}
                alt={`QR Code for ${cert.certificateNumber}`}
                className="cert-qr-img"
              />
            ) : (
              <div style={{ width: '130px', height: '130px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                QR Generating
              </div>
            )}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Official Verification QR Code
            </div>
            <Link
              to={`/verify/${cert.certificateNumber}`}
              target="_blank"
              style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
            >
              Test QR Link <ExternalLink size={11} />
            </Link>
          </div>

          <div className="cert-signature">
            <div className="signature-seal">
              <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              OFFICIALLY VERIFIED
            </div>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>Inspector of Legal Metrology</div>
            <div style={{ fontSize: '0.78rem' }}>Verification &amp; Stamping Division</div>
            <div style={{ fontSize: '0.78rem' }}>Ministry of Consumer Affairs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
