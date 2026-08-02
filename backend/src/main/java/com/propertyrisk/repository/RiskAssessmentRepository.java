package com.propertyrisk.repository;

import com.propertyrisk.model.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link RiskAssessment} persistence operations against
 * the Supabase PostgreSQL database.
 */
@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {

    List<RiskAssessment> findByUserIdOrderByGeneratedAtDesc(String userId);

    Optional<RiskAssessment> findByUserIdAndPropertyIdAndGeneratedAt(String userId, Long propertyId, Instant generatedAt);
}
