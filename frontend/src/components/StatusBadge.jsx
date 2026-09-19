import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'REGISTERED':
      return (
        <span className="badge badge-registered">
          <Clock size={12} /> Registered
        </span>
      );
    case 'PENDING_VERIFICATION':
    case 'PENDING':
      return (
        <span className="badge badge-pending">
          <Clock size={12} /> Pending Verification
        </span>
      );
    case 'VERIFIED':
    case 'APPROVED':
      return (
        <span className="badge badge-verified">
          <CheckCircle2 size={12} /> Verified
        </span>
      );
    case 'REJECTED':
      return (
        <span className="badge badge-rejected">
          <XCircle size={12} /> Rejected
        </span>
      );
    case 'VALID':
      return (
        <span className="badge badge-valid">
          <ShieldCheck size={12} /> Valid
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="badge badge-expired">
          <AlertTriangle size={12} /> Expired
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};

export default StatusBadge;
