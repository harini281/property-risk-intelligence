package com.propertyrisk.service;

import com.propertyrisk.dto.AirQualityResponseDTO;

/**
 * Application service exposing air quality data to the controller layer.
 */
public interface AirQualityService {

    /**
     * Retrieves air quality information for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return structured air quality data
     */
    AirQualityResponseDTO getAirQuality(double latitude, double longitude);
}
