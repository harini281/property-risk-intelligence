package com.propertyrisk.agents;

import com.propertyrisk.agents.interfaces.RiskAgent;
import com.propertyrisk.client.AirQualityApiClient;
import com.propertyrisk.dto.AirQualityResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Agent responsible for retrieving air quality information for a property
 * location, including the Air Quality Index (AQI), dominant pollutant, and
 * a human-readable health category.
 *
 * <p>Single responsibility: talk to {@link AirQualityApiClient} and return
 * a structured, always-non-null {@link AirQualityResponseDTO}.</p>
 */
@Component
public class AirQualityAgent implements RiskAgent<AirQualityResponseDTO> {

    private static final Logger log = LoggerFactory.getLogger(AirQualityAgent.class);

    private final AirQualityApiClient airQualityApiClient;

    public AirQualityAgent(AirQualityApiClient airQualityApiClient) {
        this.airQualityApiClient = airQualityApiClient;
    }

    /**
     * Retrieves air quality data for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return air quality data, or a failure-flagged DTO if the external call fails
     */
    @Override
    public AirQualityResponseDTO fetchData(double latitude, double longitude) {
        try {
            return airQualityApiClient.fetchAirQuality(latitude, longitude);
        } catch (Exception ex) {
            log.warn("AirQualityAgent: failed to retrieve air quality data for ({}, {}): {}",
                    latitude, longitude, ex.getMessage());
            return AirQualityResponseDTO.builder()
                    .success(false)
                    .message("Air quality data temporarily unavailable: " + ex.getMessage())
                    .build();
        }
    }
}
