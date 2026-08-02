package com.propertyrisk.repository;

import com.propertyrisk.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    List<Report> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Deduplication guard used before inserting a new report for a persisted
     * assessment. Prevents repeated report rows for the same user, address,
     * and report type.
     */
    boolean existsByUserIdAndAddressAndReportType(UUID userId, String address, String reportType);
}
