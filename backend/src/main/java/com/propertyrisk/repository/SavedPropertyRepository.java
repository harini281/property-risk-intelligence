package com.propertyrisk.repository;

import com.propertyrisk.model.SavedProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {

    List<SavedProperty> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<SavedProperty> findByUserIdAndAddress(String userId, String address);
}
