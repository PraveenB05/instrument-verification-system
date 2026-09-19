package com.sih.verification.config;

import com.sih.verification.entity.*;
import com.sih.verification.repository.CertificateRepository;
import com.sih.verification.repository.InstrumentRepository;
import com.sih.verification.repository.UserRepository;
import com.sih.verification.repository.VerificationRequestRepository;
import com.sih.verification.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private VerificationRequestRepository verificationRequestRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private CertificateService certificateService;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Seed only if database is empty
        }

        System.out.println(">>> Initializing Demo Data for SIH26036 Verification System...");

        // 1. Seed Demo Users
        User admin = new User("System Administrator", "admin@example.com", "admin123", Role.ADMIN);
        User officer = new User("Officer Ramesh Kumar", "officer@example.com", "officer123", Role.OFFICER);
        User owner1 = new User("ABC Stores (Ravi)", "owner@example.com", "owner123", Role.INSTRUMENT_OWNER);
        User owner2 = new User("XYZ Supermarket (Priya)", "supermarket@example.com", "owner123", Role.INSTRUMENT_OWNER);

        userRepository.save(admin);
        userRepository.save(officer);
        userRepository.save(owner1);
        userRepository.save(owner2);

        // 2. Seed Instruments
        // Instrument 1: Pending verification
        Instrument wm001 = new Instrument("WM001", "Digital Weighing Machine", "Salem", owner1, InstrumentStatus.PENDING_VERIFICATION);
        instrumentRepository.save(wm001);

        // Instrument 2: Registered (ready for owner to submit verification)
        Instrument wm002 = new Instrument("WM002", "Electronic Weighing Scale", "Chennai", owner1, InstrumentStatus.REGISTERED);
        instrumentRepository.save(wm002);

        // Instrument 3: Already verified with Certificate
        Instrument wm003 = new Instrument("WM003", "Platform Weighing Scale", "Coimbatore", owner2, InstrumentStatus.VERIFIED);
        instrumentRepository.save(wm003);

        // 3. Seed Verification Request for WM001 (PENDING, for officer review)
        VerificationRequest pendingRequest = new VerificationRequest(wm001, RequestStatus.PENDING);
        verificationRequestRepository.save(pendingRequest);

        // 4. Seed Verified Request & Certificate for WM003
        VerificationRequest approvedRequest = new VerificationRequest(wm003, RequestStatus.APPROVED);
        approvedRequest.setOfficer(officer);
        approvedRequest.setInspectionResult("PASS");
        approvedRequest.setRemarks("Physical calibration test verified with 20kg certified test weight. Error margin within 0.02% legal tolerance.");
        approvedRequest.setReviewedAt(LocalDateTime.now().minusDays(5));
        verificationRequestRepository.save(approvedRequest);

        // Generate Certificate with ZXing QR for WM003
        certificateService.generateCertificateForInstrument(wm003, approvedRequest.getRemarks());

        System.out.println(">>> Demo data initialized successfully!");
        System.out.println(">>> Demo Accounts:");
        System.out.println("    Admin:   admin@example.com / admin123");
        System.out.println("    Officer: officer@example.com / officer123");
        System.out.println("    Owner:   owner@example.com / owner123");
    }
}
