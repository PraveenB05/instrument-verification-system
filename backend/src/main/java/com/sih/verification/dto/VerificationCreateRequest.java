package com.sih.verification.dto;

import jakarta.validation.constraints.NotNull;

public class VerificationCreateRequest {

    @NotNull(message = "Instrument ID is required")
    private Long instrumentId;

    public VerificationCreateRequest() {
    }

    public VerificationCreateRequest(Long instrumentId) {
        this.instrumentId = instrumentId;
    }

    public Long getInstrumentId() {
        return instrumentId;
    }

    public void setInstrumentId(Long instrumentId) {
        this.instrumentId = instrumentId;
    }
}
