package com.sih.verification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InstrumentRequest {

    @NotBlank(message = "Instrument number is required")
    private String instrumentNumber;

    @NotBlank(message = "Instrument type is required")
    private String instrumentType;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    public InstrumentRequest() {
    }

    public InstrumentRequest(String instrumentNumber, String instrumentType, String location, Long ownerId) {
        this.instrumentNumber = instrumentNumber;
        this.instrumentType = instrumentType;
        this.location = location;
        this.ownerId = ownerId;
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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
}
