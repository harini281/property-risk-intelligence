package com.propertyrisk.repository;

import com.propertyrisk.model.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link RiskAssessment} persistence operations against
 * the Supabase PostgreSQL database.
 */
@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {

    // TODO: Add derived query methods for historical trend lookups,
    // e.g. findTop10ByPropertyIdOrderByGeneratedAtDesc(Long propertyId).
}
