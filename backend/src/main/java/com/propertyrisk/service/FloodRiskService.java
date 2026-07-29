package com.propertyrisk.service;

import com.propertyrisk.dto.FloodRiskResponseDTO;

/**
 * Application service exposing flood risk data to the controller layer.
 */
public interface FloodRiskService {

    /**
     * Retrieves flood risk information for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return structured flood risk data
     */
    FloodRiskResponseDTO getFloodRisk(double latitude, double longitude);
}
