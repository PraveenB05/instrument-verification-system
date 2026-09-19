package com.sih.verification.repository;

import com.sih.verification.entity.RequestStatus;
import com.sih.verification.entity.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {
    List<VerificationRequest> findByStatusOrderByRequestDateDesc(RequestStatus status);
    List<VerificationRequest> findByInstrumentOwnerIdOrderByRequestDateDesc(Long ownerId);
    List<VerificationRequest> findAllByOrderByRequestDateDesc();
    Optional<VerificationRequest> findTopByInstrumentIdOrderByRequestDateDesc(Long instrumentId);
    long countByStatus(RequestStatus status);
}
