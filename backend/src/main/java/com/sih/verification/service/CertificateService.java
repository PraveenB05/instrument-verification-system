package com.sih.verification.service;

import com.sih.verification.dto.CertificateResponse;
import com.sih.verification.dto.PublicVerificationDto;
import com.sih.verification.entity.Certificate;
import com.sih.verification.entity.CertificateStatus;
import com.sih.verification.entity.Instrument;
import com.sih.verification.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private QrCodeService qrCodeService;

    @Autowired
    private PdfCertificateService pdfCertificateService;

    @Value("${app.verification.base-url:http://localhost:5173/verify/}")
    private String verificationBaseUrl;

    public Certificate generateCertificateForInstrument(Instrument instrument, String inspectionRemarks) {
        // Unique certificate number format: LM-YYYY-XXXX
        int currentYear = LocalDate.now().getYear();
        String certNumber = String.format("LM-%d-%04d", currentYear, instrument.getId());

        // Check if certificate already exists for this instrument (e.g. renewal)
        Certificate certificate = certificateRepository.findByInstrumentId(instrument.getId())
                .orElse(new Certificate());

        LocalDate issueDate = LocalDate.now();
        LocalDate expiryDate = issueDate.plusYears(1);
        String publicVerificationUrl = verificationBaseUrl + certNumber;

        // Generate QR code encoding the public verification URL as Base64 Data URL
        String qrCodeData = qrCodeService.generateQrCodeBase64(publicVerificationUrl, 260, 260);

        certificate.setCertificateNumber(certNumber);
        certificate.setInstrument(instrument);
        certificate.setIssueDate(issueDate);
        certificate.setExpiryDate(expiryDate);
        certificate.setStatus(CertificateStatus.VALID);
        certificate.setQrCodeData(qrCodeData);

        return certificateRepository.save(certificate);
    }

    public CertificateResponse getCertificateById(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with ID: " + id));
        return toResponse(certificate);
    }

    public CertificateResponse getCertificateByInstrumentId(Long instrumentId) {
        Certificate certificate = certificateRepository.findByInstrumentId(instrumentId)
                .orElseThrow(() -> new RuntimeException("No certificate found for instrument ID: " + instrumentId));
        return toResponse(certificate);
    }

    public List<CertificateResponse> getAllCertificates() {
        return certificateRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PublicVerificationDto getPublicVerification(String certificateNumber) {
        Optional<Certificate> certOpt = certificateRepository.findByCertificateNumber(certificateNumber);
        if (certOpt.isEmpty()) {
            return PublicVerificationDto.notFound(certificateNumber);
        }

        Certificate cert = certOpt.get();
        PublicVerificationDto dto = new PublicVerificationDto();
        dto.setCertificateNumber(cert.getCertificateNumber());
        dto.setInstrumentNumber(cert.getInstrument().getInstrumentNumber());
        dto.setInstrumentType(cert.getInstrument().getInstrumentType());
        dto.setLocation(cert.getInstrument().getLocation());
        dto.setOwnerName(cert.getInstrument().getOwner().getName());
        dto.setIssueDate(cert.getIssueDate());
        dto.setExpiryDate(cert.getExpiryDate());

        // Check expiry
        if (cert.getExpiryDate() != null && cert.getExpiryDate().isBefore(LocalDate.now())) {
            dto.setValid(false);
            dto.setStatus(CertificateStatus.EXPIRED);
            dto.setMessage("CERTIFICATE EXPIRED - The verification certificate has expired. Re-calibration and verification required.");
        } else {
            dto.setValid(true);
            dto.setStatus(CertificateStatus.VALID);
            dto.setMessage("CERTIFICATE VALID - This instrument is officially verified and certified for commercial transactions.");
        }

        return dto;
    }

    public byte[] generatePdf(Long certId) {
        Certificate certificate = certificateRepository.findById(certId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with ID: " + certId));
        String publicVerificationUrl = verificationBaseUrl + certificate.getCertificateNumber();
        return pdfCertificateService.generateCertificatePdf(certificate, publicVerificationUrl);
    }

    public CertificateResponse toResponse(Certificate cert) {
        CertificateResponse res = new CertificateResponse();
        res.setId(cert.getId());
        res.setCertificateNumber(cert.getCertificateNumber());
        res.setInstrumentId(cert.getInstrument().getId());
        res.setInstrumentNumber(cert.getInstrument().getInstrumentNumber());
        res.setInstrumentType(cert.getInstrument().getInstrumentType());
        res.setLocation(cert.getInstrument().getLocation());
        res.setOwnerName(cert.getInstrument().getOwner().getName());
        res.setIssueDate(cert.getIssueDate());
        res.setExpiryDate(cert.getExpiryDate());
        res.setStatus(cert.getStatus());
        res.setQrCodeData(cert.getQrCodeData());
        res.setPublicVerificationUrl(verificationBaseUrl + cert.getCertificateNumber());
        return res;
    }
}
