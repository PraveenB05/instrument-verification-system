package com.sih.verification;

import com.sih.verification.dto.PublicVerificationDto;
import com.sih.verification.service.CertificateService;
import com.sih.verification.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class VerificationSystemApplicationTests {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private CertificateService certificateService;

    @Test
    void contextLoads() {
        assertNotNull(dashboardService, "DashboardService should be loaded");
        assertNotNull(certificateService, "CertificateService should be loaded");
    }

    @Test
    void testPreSeededDataAndStats() {
        var stats = dashboardService.getStats();
        assertTrue(stats.getTotalUsers() >= 3, "Demo users should be seeded");
        assertTrue(stats.getTotalInstruments() >= 3, "Demo instruments should be seeded");
        assertTrue(stats.getPendingRequests() >= 1, "Demo pending request should be seeded");
        assertTrue(stats.getTotalCertificates() >= 1, "Demo certificate should be seeded");
    }

    @Test
    void testPublicVerificationService() {
        // Pre-seeded WM003 certificate is generated on startup with format LM-YYYY-0003
        var allCerts = certificateService.getAllCertificates();
        assertFalse(allCerts.isEmpty(), "Should have at least one certificate");

        String certNum = allCerts.get(0).getCertificateNumber();
        PublicVerificationDto dto = certificateService.getPublicVerification(certNum);

        assertTrue(dto.isValid(), "Pre-seeded certificate should be valid");
        assertNotNull(dto.getOwnerName(), "Owner name should be populated");
        assertNotNull(dto.getIssueDate(), "Issue date should be populated");

        // Test non-existent certificate
        PublicVerificationDto invalidDto = certificateService.getPublicVerification("LM-FAKE-9999");
        assertFalse(invalidDto.isValid(), "Fake certificate should not be valid");
    }
}
