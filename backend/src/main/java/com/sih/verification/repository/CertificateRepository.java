package com.sih.verification.repository;

import com.sih.verification.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    Optional<Certificate> findByInstrumentId(Long instrumentId);
    boolean existsByCertificateNumber(String certificateNumber);
}
