package com.propertyrisk.dto;

import com.propertyrisk.model.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Combined risk report produced by {@code PropertyRiskAgent}, aggregating
 * the results of the weather, flood, and air quality agents into a single
 * overall risk determination.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyRiskReportDTO {

    private Double latitude;
    private Double longitude;

    private RiskLevel overallRiskLevel;

    private WeatherResponseDTO weather;
    private FloodRiskResponseDTO flood;
    private AirQualityResponseDTO airQuality;

    private Instant generatedAt;
}
