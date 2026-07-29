package com.propertyrisk.repository;

import com.propertyrisk.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link Property} persistence operations against
 * the Supabase PostgreSQL database.
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // TODO: Add derived query methods as lookup requirements emerge,
    // e.g. findByLatitudeAndLongitude(double lat, double lon).
}