package com.propertyrisk.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA entity representing a generated property risk report stored in the
 * Supabase PostgreSQL {@code reports} table.
 *
 * <p>Schema alignment (see migration 20260710184846):
 * <ul>
 *   <li>{@code id} — uuid PK defaulted by {@code gen_random_uuid()}</li>
 *   <li>{@code user_id} — uuid FK to {@code auth.users(id)}</li>
 *   <li>{@code created_at} — timestamptz defaulted to {@code now()} (nullable)</li>
 * </ul>
 */
@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "address", nullable = false, columnDefinition = "text")
    private String address;

    @Column(name = "report_type", nullable = false, columnDefinition = "text")
    private String reportType;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "summary", columnDefinition = "text")
    private String summary;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at")
    private Instant createdAt;
}