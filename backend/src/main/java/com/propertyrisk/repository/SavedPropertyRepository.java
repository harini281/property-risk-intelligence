package com.propertyrisk.repository;

import com.propertyrisk.model.SavedProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedPropertyRepository extends JpaRepository<SavedProperty, UUID> {

    List<SavedProperty> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<SavedProperty> findByUserIdAndAddress(UUID userId, String address);
}
