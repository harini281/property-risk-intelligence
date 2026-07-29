package com.propertyrisk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** A normalized address result returned by the configured geocoding provider. */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeocodingResponseDTO {
    private String displayName;
    private Double latitude;
    private Double longitude;
    private boolean success;
    private String message;
}
