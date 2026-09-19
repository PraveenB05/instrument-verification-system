package com.sih.verification.service;

import com.sih.verification.dto.DashboardStatsDto;
import com.sih.verification.entity.InstrumentStatus;
import com.sih.verification.entity.RequestStatus;
import com.sih.verification.repository.CertificateRepository;
import com.sih.verification.repository.InstrumentRepository;
import com.sih.verification.repository.UserRepository;
import com.sih.verification.repository.VerificationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private VerificationRequestRepository verificationRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private InstrumentService instrumentService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private CertificateService certificateService;

    public DashboardStatsDto getStats() {
        long totalInstruments = instrumentRepository.count();
        long pending = verificationRequestRepository.countByStatus(RequestStatus.PENDING);
        long verified = instrumentRepository.countByStatus(InstrumentStatus.VERIFIED);
        long rejected = instrumentRepository.countByStatus(InstrumentStatus.REJECTED);
        long totalUsers = userRepository.count();
        long totalCerts = certificateRepository.count();

        return new DashboardStatsDto(
                totalInstruments,
                pending,
                verified,
                rejected,
                totalUsers,
                totalCerts
        );
    }

    public Map<String, Object> getAdminFullData() {
        Map<String, Object> data = new HashMap<>();
        data.put("stats", getStats());
        data.put("users", userRepository.findAll());
        data.put("instruments", instrumentService.getInstruments(null));
        data.put("verifications", verificationService.getRequests(null));
        data.put("certificates", certificateService.getAllCertificates());
        return data;
    }
}
