package com.sih.verification.controller;

import com.sih.verification.dto.VerificationCreateRequest;
import com.sih.verification.dto.VerificationDecisionRequest;
import com.sih.verification.dto.VerificationResponse;
import com.sih.verification.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @PostMapping
    public ResponseEntity<?> submitRequest(@Valid @RequestBody VerificationCreateRequest request) {
        try {
            VerificationResponse response = verificationService.submitRequest(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<VerificationResponse>> getRequests(@RequestParam(required = false) Long ownerId) {
        List<VerificationResponse> list = verificationService.getRequests(ownerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<VerificationResponse>> getPendingRequests() {
        List<VerificationResponse> pending = verificationService.getPendingRequests();
        return ResponseEntity.ok(pending);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        try {
            VerificationResponse response = verificationService.getRequestById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestBody VerificationDecisionRequest decision) {
        try {
            VerificationResponse response = verificationService.approveRequest(id, decision);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, @RequestBody VerificationDecisionRequest decision) {
        try {
            VerificationResponse response = verificationService.rejectRequest(id, decision);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
