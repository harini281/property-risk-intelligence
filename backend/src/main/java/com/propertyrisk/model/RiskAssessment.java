package com.propertyrisk.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA entity capturing a point-in-time property risk assessment result,
 * enabling historical trend queries against Supabase PostgreSQL.
 *
 * <p>Schema alignment (see migration 20260802120000):
 * <ul>
 *   <li>{@code id} — bigserial PK</li>
 *   <li>{@code user_id} — uuid FK to {@code auth.users(id)}</li>
 *   <li>{@code property_id} — bigint FK to {@code properties(id)}</li>
 *   <li>{@code overall_risk_level} — text (stored as enum string)</li>
 *   <li>{@code generated_at} — timestamptz defaulted to {@code now()}</li>
 * </ul>
 */
@Entity
@Table(name = "risk_assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne
    @JoinColumn(name = "property_id", referencedColumnName = "id")
    private Property property;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_risk_level", nullable = false, columnDefinition = "text")
    private RiskLevel overallRiskLevel;

    @Column(name = "generated_at", nullable = false)
    private Instant generatedAt;

    // TODO: Persist individual agent risk levels (weather/flood/air quality)
    // as separate columns or a related table once reporting requirements
    // are defined.
}
