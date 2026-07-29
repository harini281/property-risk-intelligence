package com.propertyrisk.agents;

import com.propertyrisk.dto.PropertyRiskReportDTO;
import com.propertyrisk.util.RiskCalculator;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Coordinating agent that orchestrates {@link WeatherAgent},
 * {@link FloodRiskAgent}, and {@link AirQualityAgent} to produce a single
 * combined {@link PropertyRiskReportDTO} for a property location.
 *
 * <p>This class deliberately contains no external-API knowledge of its
 * own - it depends only on the other agents' public contracts, keeping
 * coordination logic decoupled from data-retrieval details.</p>
 */
@Component
public class PropertyRiskAgent {

    private final WeatherAgent weatherAgent;
    private final FloodRiskAgent floodRiskAgent;
    private final AirQualityAgent airQualityAgent;

    public PropertyRiskAgent(WeatherAgent weatherAgent,
                              FloodRiskAgent floodRiskAgent,
                              AirQualityAgent airQualityAgent) {
        this.weatherAgent = weatherAgent;
        this.floodRiskAgent = floodRiskAgent;
        this.airQualityAgent = airQualityAgent;
    }

    /**
     * Gathers results from all domain agents and produces a combined
     * property risk report.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return combined risk report with an overall risk level
     */
    public PropertyRiskReportDTO assessPropertyRisk(double latitude, double longitude) {
        var weather = weatherAgent.fetchData(latitude, longitude);
        var flood = floodRiskAgent.fetchData(latitude, longitude);
        var airQuality = airQualityAgent.fetchData(latitude, longitude);

        var overallRisk = RiskCalculator.calculateOverallRisk(weather, flood, airQuality);

        return PropertyRiskReportDTO.builder()
                .latitude(latitude)
                .longitude(longitude)
                .weather(weather)
                .flood(flood)
                .airQuality(airQuality)
                .overallRiskLevel(overallRisk)
                .generatedAt(Instant.now())
                .build();
    }
}
