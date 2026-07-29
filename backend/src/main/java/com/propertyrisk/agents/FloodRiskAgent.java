package com.propertyrisk.agents;

import com.propertyrisk.agents.interfaces.RiskAgent;
import com.propertyrisk.client.FloodApiClient;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.model.RiskLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Agent responsible for retrieving flood risk information for a property
 * location, such as flood zone classification and active flood warnings
 * (e.g. sourced from FEMA's National Flood Hazard Layer).
 *
 * <p>Single responsibility: talk to {@link FloodApiClient} and return a
 * structured, always-non-null {@link FloodRiskResponseDTO}.</p>
 */
@Component
public class FloodRiskAgent implements RiskAgent<FloodRiskResponseDTO> {

    private static final Logger log = LoggerFactory.getLogger(FloodRiskAgent.class);

    private final FloodApiClient floodApiClient;

    public FloodRiskAgent(FloodApiClient floodApiClient) {
        this.floodApiClient = floodApiClient;
    }

    /**
     * Retrieves flood risk data for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return flood risk data, or a failure-flagged DTO if the external call fails
     */
    @Override
    public FloodRiskResponseDTO fetchData(double latitude, double longitude) {
        try {
            return floodApiClient.fetchFloodRisk(latitude, longitude);
        } catch (Exception ex) {
            log.warn("FloodRiskAgent: failed to retrieve flood data for ({}, {}): {}",
                    latitude, longitude, ex.getMessage());
            return FloodRiskResponseDTO.builder()
                    .floodRiskLevel(RiskLevel.UNKNOWN)
                    .success(false)
                    .message("Flood risk data temporarily unavailable: " + ex.getMessage())
                    .build();
        }
    }
}
