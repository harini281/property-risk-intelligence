package com.propertyrisk.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * JPA entity capturing a point-in-time property risk assessment result,
 * enabling historical trend queries against Supabase PostgreSQL.
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
    private Long id;

    @ManyToOne
    private Property property;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel overallRiskLevel;

    @Column(nullable = false)
    private Instant generatedAt;

    // TODO: Persist individual agent risk levels (weather/flood/air quality)
    // as separate columns or a related table once reporting requirements
    // are defined.
}
