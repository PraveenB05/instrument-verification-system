package com.sih.verification.dto;

import com.sih.verification.entity.CertificateStatus;
import java.time.LocalDate;

public class PublicVerificationDto {

    private boolean valid;
    private String message;
    private String certificateNumber;
    private String instrumentNumber;
    private String instrumentType;
    private String location;
    private String ownerName;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private CertificateStatus status;
    private String remarks;

    public PublicVerificationDto() {
    }

    public static PublicVerificationDto notFound(String certificateNumber) {
        PublicVerificationDto dto = new PublicVerificationDto();
        dto.setValid(false);
        dto.setMessage("CERTIFICATE NOT FOUND - This certificate number does not exist in the official Legal Metrology registry.");
        dto.setCertificateNumber(certificateNumber);
        return dto;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getInstrumentNumber() {
        return instrumentNumber;
    }

    public void setInstrumentNumber(String instrumentNumber) {
        this.instrumentNumber = instrumentNumber;
    }

    public String getInstrumentType() {
        return instrumentType;
    }

    public void setInstrumentType(String instrumentType) {
        this.instrumentType = instrumentType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
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
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
