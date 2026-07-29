package com.propertyrisk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Structured air quality data returned by {@code AirQualityAgent}.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AirQualityResponseDTO {

    private Integer aqi;
    private String dominantPollutant;
    private String healthCategory;

    /** Whether the underlying external call succeeded. */
    private boolean success;

    /** Human-readable status or error detail. */
    private String message;
}
