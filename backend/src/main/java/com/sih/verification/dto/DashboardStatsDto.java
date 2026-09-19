package com.sih.verification.dto;

public class DashboardStatsDto {

    private long totalInstruments;
    private long pendingRequests;
    private long verifiedInstruments;
    private long rejectedRequests;
    private long totalUsers;
    private long totalCertificates;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalInstruments, long pendingRequests, long verifiedInstruments, long rejectedRequests, long totalUsers, long totalCertificates) {
        this.totalInstruments = totalInstruments;
        this.pendingRequests = pendingRequests;
        this.verifiedInstruments = verifiedInstruments;
        this.rejectedRequests = rejectedRequests;
        this.totalUsers = totalUsers;
        this.totalCertificates = totalCertificates;
    }

    public long getTotalInstruments() {
        return totalInstruments;
    }

    public void setTotalInstruments(long totalInstruments) {
        this.totalInstruments = totalInstruments;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getVerifiedInstruments() {
        return verifiedInstruments;
    }

    public void setVerifiedInstruments(long verifiedInstruments) {
        this.verifiedInstruments = verifiedInstruments;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }
}
