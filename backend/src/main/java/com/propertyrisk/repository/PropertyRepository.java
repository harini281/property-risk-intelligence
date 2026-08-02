package com.propertyrisk.repository;

import com.propertyrisk.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link Property} persistence operations against
 * the Supabase PostgreSQL database.
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    Optional<Property> findByLatitudeAndLongitude(double latitude, double longitude);
}