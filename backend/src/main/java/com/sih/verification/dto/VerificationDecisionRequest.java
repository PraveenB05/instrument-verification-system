package com.sih.verification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VerificationDecisionRequest {

    @NotNull(message = "Officer ID is required")
    private Long officerId;

    @NotBlank(message = "Inspection result is required (PASS or FAIL)")
    private String inspectionResult; // PASS or FAIL

    private String remarks;

    public VerificationDecisionRequest() {
    }

    public VerificationDecisionRequest(Long officerId, String inspectionResult, String remarks) {
        this.officerId = officerId;
        this.inspectionResult = inspectionResult;
        this.remarks = remarks;
    }

    public Long getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public String getInspectionResult() {
        return inspectionResult;
    }

    public void setInspectionResult(String inspectionResult) {
        this.inspectionResult = inspectionResult;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
