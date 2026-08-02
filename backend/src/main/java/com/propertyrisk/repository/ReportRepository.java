package com.propertyrisk.repository;

import com.propertyrisk.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUserIdOrderByCreatedAtDesc(String userId);
}
