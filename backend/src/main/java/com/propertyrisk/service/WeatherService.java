package com.propertyrisk.service;

import com.propertyrisk.dto.WeatherResponseDTO;

/**
 * Application service exposing weather data to the controller layer.
 *
 * <p>Depending on this interface (rather than {@code WeatherAgent}
 * directly) lets controllers stay decoupled from the agent implementation,
 * consistent with the Dependency Inversion Principle.</p>
 */
public interface WeatherService {

    /**
     * Retrieves current weather conditions for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return structured weather data
     */
    WeatherResponseDTO getWeather(double latitude, double longitude);
}
