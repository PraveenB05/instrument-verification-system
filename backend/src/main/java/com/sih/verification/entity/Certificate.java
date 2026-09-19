package com.sih.verification.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 50)
    private String certificateNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instrument_id", nullable = false, unique = true)
    private Instrument instrument;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CertificateStatus status;

    @Column(name = "qr_code_data", nullable = false, columnDefinition = "TEXT")
    private String qrCodeData;

    public Certificate() {
    }

    public Certificate(String certificateNumber, Instrument instrument, LocalDate issueDate, LocalDate expiryDate, CertificateStatus status, String qrCodeData) {
        this.certificateNumber = certificateNumber;
        this.instrument = instrument;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.status = status;
        this.qrCodeData = qrCodeData;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public Instrument getInstrument() {
        return instrument;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public CertificateStatus getStatus() {
        // Auto-check expiry against today's date if valid
        if (this.status == CertificateStatus.VALID && this.expiryDate != null && this.expiryDate.isBefore(LocalDate.now())) {
            return CertificateStatus.EXPIRED;
        }
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getQrCodeData() {
        return qrCodeData;
    }

    public void setQrCodeData(String qrCodeData) {
        this.qrCodeData = qrCodeData;
    }
}
