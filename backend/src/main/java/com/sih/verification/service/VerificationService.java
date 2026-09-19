package com.sih.verification.service;

import com.sih.verification.dto.VerificationCreateRequest;
import com.sih.verification.dto.VerificationDecisionRequest;
import com.sih.verification.dto.VerificationResponse;
import com.sih.verification.entity.*;
import com.sih.verification.repository.VerificationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VerificationService {

    @Autowired
    private VerificationRequestRepository verificationRequestRepository;

    @Autowired
    private InstrumentService instrumentService;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private AuthService authService;

    @Transactional
    public VerificationResponse submitRequest(VerificationCreateRequest request) {
        Instrument instrument = instrumentService.findEntityById(request.getInstrumentId());

        if (instrument.getStatus() == InstrumentStatus.PENDING_VERIFICATION) {
            throw new RuntimeException("A verification request is already pending for instrument: " + instrument.getInstrumentNumber());
        }

        // Update instrument status to pending
        instrument.setStatus(InstrumentStatus.PENDING_VERIFICATION);
        instrumentService.saveEntity(instrument);

        // Create new verification request
        VerificationRequest vr = new VerificationRequest(instrument, RequestStatus.PENDING);
        VerificationRequest saved = verificationRequestRepository.save(vr);

        return toResponse(saved);
    }

    public List<VerificationResponse> getPendingRequests() {
        return verificationRequestRepository.findByStatusOrderByRequestDateDesc(RequestStatus.PENDING)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<VerificationResponse> getRequests(Long ownerId) {
        List<VerificationRequest> list;
        if (ownerId != null) {
            list = verificationRequestRepository.findByInstrumentOwnerIdOrderByRequestDateDesc(ownerId);
        } else {
            list = verificationRequestRepository.findAllByOrderByRequestDateDesc();
        }
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public VerificationResponse getRequestById(Long id) {
        VerificationRequest vr = verificationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification request not found with ID: " + id));
        return toResponse(vr);
    }

    @Transactional
    public VerificationResponse approveRequest(Long id, VerificationDecisionRequest decision) {
        VerificationRequest vr = verificationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification request not found with ID: " + id));

        if (vr.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Cannot approve a request that is already " + vr.getStatus());
        }

        User officer = authService.findEntityById(decision.getOfficerId());
        vr.setOfficer(officer);
        vr.setInspectionResult(decision.getInspectionResult() != null ? decision.getInspectionResult() : "PASS");
        vr.setRemarks(decision.getRemarks());
        vr.setStatus(RequestStatus.APPROVED);
        vr.setReviewedAt(LocalDateTime.now());

        // Update instrument status to VERIFIED
        Instrument instrument = vr.getInstrument();
        instrument.setStatus(InstrumentStatus.VERIFIED);
        instrumentService.saveEntity(instrument);

        // Generate digital certificate with QR code
        certificateService.generateCertificateForInstrument(instrument, decision.getRemarks());

        VerificationRequest updated = verificationRequestRepository.save(vr);
        return toResponse(updated);
    }

    @Transactional
    public VerificationResponse rejectRequest(Long id, VerificationDecisionRequest decision) {
        VerificationRequest vr = verificationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification request not found with ID: " + id));

        if (vr.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Cannot reject a request that is already " + vr.getStatus());
        }

        User officer = authService.findEntityById(decision.getOfficerId());
        vr.setOfficer(officer);
        vr.setInspectionResult(decision.getInspectionResult() != null ? decision.getInspectionResult() : "FAIL");
        vr.setRemarks(decision.getRemarks());
        vr.setStatus(RequestStatus.REJECTED);
        vr.setReviewedAt(LocalDateTime.now());

        // Update instrument status to REJECTED
        Instrument instrument = vr.getInstrument();
        instrument.setStatus(InstrumentStatus.REJECTED);
        instrumentService.saveEntity(instrument);

        VerificationRequest updated = verificationRequestRepository.save(vr);
        return toResponse(updated);
    }

    public VerificationResponse toResponse(VerificationRequest vr) {
        VerificationResponse res = new VerificationResponse();
        res.setId(vr.getId());
        res.setInstrumentId(vr.getInstrument().getId());
        res.setInstrumentNumber(vr.getInstrument().getInstrumentNumber());
        res.setInstrumentType(vr.getInstrument().getInstrumentType());
        res.setLocation(vr.getInstrument().getLocation());
        res.setOwnerName(vr.getInstrument().getOwner().getName());
        res.setOfficerName(vr.getOfficer() != null ? vr.getOfficer().getName() : "Unassigned");
        res.setRequestDate(vr.getRequestDate());
        res.setInspectionResult(vr.getInspectionResult());
        res.setRemarks(vr.getRemarks());
        res.setStatus(vr.getStatus());
        res.setReviewedAt(vr.getReviewedAt());
        return res;
    }
}
