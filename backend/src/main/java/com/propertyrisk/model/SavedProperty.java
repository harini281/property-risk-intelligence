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
 * JPA entity representing a user-saved/bookmarked property stored in the
 * Supabase PostgreSQL {@code saved_properties} table.
 *
 * <p>Schema alignment (see migration 20260710184846):
 * <ul>
 *   <li>{@code id} — uuid PK defaulted by {@code gen_random_uuid()}</li>
 *   <li>{@code user_id} — uuid FK to {@code auth.users(id)}</li>
 *   <li>{@code created_at} — timestamptz defaulted to {@code now()} (nullable)</li>
 * </ul>
 */
@Entity
@Table(name = "saved_properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "address", nullable = false, columnDefinition = "text")
    private String address;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    @Column(name = "created_at")
    private Instant createdAt;
}
