package com.propertyrisk.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA entity representing a physical property tracked by the system.
 *
 * <p>Persisted to the Supabase-hosted PostgreSQL database. Coordinates are
 * used as the primary input to the risk agents.</p>
 *
 * <p>Schema alignment (see migration 20260802120000):
 * <ul>
 *   <li>{@code id} — bigserial PK</li>
 *   <li>{@code address} — text, not null</li>
 *   <li>{@code latitude}/{@code longitude} — double precision, not null</li>
 *   <li>Unique constraint {@code uq_properties_coordinates (latitude, longitude)}</li>
 * </ul>
 */
@Entity
@Table(name = "properties", uniqueConstraints = {
        @UniqueConstraint(name = "uq_properties_coordinates", columnNames = {"latitude", "longitude"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "address", nullable = false, columnDefinition = "text")
    private String address;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    // TODO: Add auditing fields (createdAt, updatedAt) once persistence
    // requirements for historical risk tracking are finalized.
}
