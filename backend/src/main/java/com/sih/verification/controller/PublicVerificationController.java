package com.sih.verification.controller;

import com.sih.verification.dto.PublicVerificationDto;
import com.sih.verification.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicVerificationController {

    @Autowired
    private CertificateService certificateService;

    @GetMapping("/verify/{certificateNumber}")
    public ResponseEntity<PublicVerificationDto> verifyCertificate(@PathVariable String certificateNumber) {
        PublicVerificationDto result = certificateService.getPublicVerification(certificateNumber);
        return ResponseEntity.ok(result);
    }
}
