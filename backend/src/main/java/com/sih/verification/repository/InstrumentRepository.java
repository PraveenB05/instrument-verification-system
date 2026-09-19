package com.sih.verification.repository;

import com.sih.verification.entity.Instrument;
import com.sih.verification.entity.InstrumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, Long> {
    Optional<Instrument> findByInstrumentNumber(String instrumentNumber);
    boolean existsByInstrumentNumber(String instrumentNumber);
    List<Instrument> findByOwnerId(Long ownerId);
    long countByStatus(InstrumentStatus status);
}
