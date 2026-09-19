package com.sih.verification.controller;

import com.sih.verification.dto.InstrumentRequest;
import com.sih.verification.dto.InstrumentResponse;
import com.sih.verification.service.InstrumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instruments")
public class InstrumentController {

    @Autowired
    private InstrumentService instrumentService;

    @PostMapping
    public ResponseEntity<?> registerInstrument(@Valid @RequestBody InstrumentRequest request) {
        try {
            InstrumentResponse response = instrumentService.registerInstrument(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<InstrumentResponse>> getInstruments(@RequestParam(required = false) Long ownerId) {
        List<InstrumentResponse> instruments = instrumentService.getInstruments(ownerId);
        return ResponseEntity.ok(instruments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInstrumentById(@PathVariable Long id) {
        try {
            InstrumentResponse instrument = instrumentService.getInstrumentById(id);
            return ResponseEntity.ok(instrument);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
