package com.propertyrisk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Structured weather data returned by {@code WeatherAgent}.
 *
 * <p>{@code success} and {@code message} allow callers to distinguish a
 * genuine "no risk" result from an upstream API failure.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherResponseDTO {

    private Double temperatureCelsius;
    private Double humidityPercent;
    private Double windSpeedKph;
    private String condition;
    private String location;

    /** Whether the underlying external call succeeded. */
    private boolean success;

    /** Human-readable status or error detail. */
    private String message;
}
