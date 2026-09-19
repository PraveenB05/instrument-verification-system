import axios from 'axios';

const API_BASE_URL = 'https://instrument-verification-system-cmn1.onrender.com/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),

  // Instruments
  getInstruments: (ownerId) => {
    const params = ownerId ? { ownerId } : {};
    return axiosClient.get('/instruments', { params });
  },
  getInstrumentById: (id) => axiosClient.get(`/instruments/${id}`),
  createInstrument: (data) => axiosClient.post('/instruments', data),

  // Verifications
  submitVerification: (data) => axiosClient.post('/verifications', data),
  getVerifications: (ownerId) => {
    const params = ownerId ? { ownerId } : {};
    return axiosClient.get('/verifications', { params });
  },
  getPendingVerifications: () => axiosClient.get('/verifications/pending'),
  getVerificationById: (id) => axiosClient.get(`/verifications/${id}`),
  approveVerification: (id, decision) => axiosClient.put(`/verifications/${id}/approve`, decision),
  rejectVerification: (id, decision) => axiosClient.put(`/verifications/${id}/reject`, decision),

  // Certificates
  getCertificateById: (id) => axiosClient.get(`/certificates/${id}`),
  getCertificateByInstrument: (instrumentId) => axiosClient.get(`/certificates/by-instrument/${instrumentId}`),
  downloadCertificatePdfUrl: (id) => `${API_BASE_URL}/certificates/${id}/pdf`,

  // Public Verification (QR Code)
  verifyPublicCertificate: (certNumber) => axiosClient.get(`/public/verify/${certNumber}`),

  // Dashboard Stats
  getDashboardStats: () => axiosClient.get('/dashboard/stats'),
  getAdminData: () => axiosClient.get('/dashboard/admin-data'),
};

export default axiosClient;
