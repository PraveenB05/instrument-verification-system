package com.sih.verification.service;

import com.sih.verification.dto.InstrumentRequest;
import com.sih.verification.dto.InstrumentResponse;
import com.sih.verification.entity.Certificate;
import com.sih.verification.entity.Instrument;
import com.sih.verification.entity.InstrumentStatus;
import com.sih.verification.entity.User;
import com.sih.verification.repository.CertificateRepository;
import com.sih.verification.repository.InstrumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InstrumentService {

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private AuthService authService;

    public InstrumentResponse registerInstrument(InstrumentRequest request) {
        if (instrumentRepository.existsByInstrumentNumber(request.getInstrumentNumber())) {
            throw new RuntimeException("Instrument number '" + request.getInstrumentNumber() + "' is already registered.");
        }

        User owner = authService.findEntityById(request.getOwnerId());

        Instrument instrument = new Instrument(
                request.getInstrumentNumber().trim().toUpperCase(),
                request.getInstrumentType().trim(),
                request.getLocation().trim(),
                owner,
                InstrumentStatus.REGISTERED
        );

        Instrument saved = instrumentRepository.save(instrument);
        return toResponse(saved);
    }

    public List<InstrumentResponse> getInstruments(Long ownerId) {
        List<Instrument> list;
        if (ownerId != null) {
            list = instrumentRepository.findByOwnerId(ownerId);
        } else {
            list = instrumentRepository.findAll();
        }
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InstrumentResponse getInstrumentById(Long id) {
        Instrument instrument = findEntityById(id);
        return toResponse(instrument);
    }

    public Instrument findEntityById(Long id) {
        return instrumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrument not found with ID: " + id));
    }

    public Instrument saveEntity(Instrument instrument) {
        return instrumentRepository.save(instrument);
    }

    public InstrumentResponse toResponse(Instrument instrument) {
        InstrumentResponse res = new InstrumentResponse();
        res.setId(instrument.getId());
        res.setInstrumentNumber(instrument.getInstrumentNumber());
        res.setInstrumentType(instrument.getInstrumentType());
        res.setLocation(instrument.getLocation());
        res.setOwnerId(instrument.getOwner().getId());
        res.setOwnerName(instrument.getOwner().getName());
        res.setStatus(instrument.getStatus());
        res.setCreatedAt(instrument.getCreatedAt());

        // Find certificate if verified
        Optional<Certificate> certOpt = certificateRepository.findByInstrumentId(instrument.getId());
        certOpt.ifPresent(certificate -> res.setCertificateNumber(certificate.getCertificateNumber()));

        return res;
    }
}
