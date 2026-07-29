package com.propertyrisk.agents;

import com.propertyrisk.agents.interfaces.RiskAgent;
import com.propertyrisk.client.WeatherApiClient;
import com.propertyrisk.dto.WeatherResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Agent responsible for retrieving current weather conditions for a
 * property location.
 *
 * <p>Single responsibility: talk to {@link WeatherApiClient} and return a
 * structured, always-non-null {@link WeatherResponseDTO}. Any failure from
 * the external provider is caught here so downstream callers (e.g.
 * {@code PropertyRiskAgent}) never have to handle exceptions from this
 * agent directly.</p>
 */
@Component
public class WeatherAgent implements RiskAgent<WeatherResponseDTO> {

    private static final Logger log = LoggerFactory.getLogger(WeatherAgent.class);

    private final WeatherApiClient weatherApiClient;

    public WeatherAgent(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }

    /**
     * Retrieves structured weather data for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return weather data, or a failure-flagged DTO if the external call fails
     */
    @Override
    public WeatherResponseDTO fetchData(double latitude, double longitude) {
        try {
            return weatherApiClient.fetchWeather(latitude, longitude);
        } catch (Exception ex) {
            log.warn("WeatherAgent: failed to retrieve weather data for ({}, {}): {}",
                    latitude, longitude, ex.getMessage());
            return WeatherResponseDTO.builder()
                    .success(false)
                    .message("Weather data temporarily unavailable: " + ex.getMessage())
                    .build();
        }
    }
}
