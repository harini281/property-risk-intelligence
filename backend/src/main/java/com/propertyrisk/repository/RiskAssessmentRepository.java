package com.propertyrisk.repository;

import com.propertyrisk.model.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link RiskAssessment} persistence operations against
 * the Supabase PostgreSQL database.
 */
@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {

    List<RiskAssessment> findByUserIdOrderByGeneratedAtDesc(UUID userId);

    Optional<RiskAssessment> findByUserIdAndPropertyIdAndGeneratedAt(UUID userId, Long propertyId, Instant generatedAt);

    /**
     * Stable deduplication guard used before inserting a new assessment.
     * Prevents repeated assessment rows for the same user and property
     * (the timestamp-based lookup is not stable because generatedAt is
     * always set to Instant.now() by the agent).
     */
    Optional<RiskAssessment> findByUserIdAndPropertyId(UUID userId, Long propertyId);
}
