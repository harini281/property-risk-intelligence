package com.propertyrisk.client;

import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.AirQualityResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Low-level HTTP client responsible for calling an external air quality
 * data provider (e.g. IQAir, OpenWeatherMap Air Pollution API, AirNow).
 *
 * <p>Owns only the raw HTTP call and response mapping; risk interpretation
 * lives in {@code AirQualityAgent}.</p>
 */
@Component
public class AirQualityApiClient {

    private final RestTemplate restTemplate;
    private final ExternalApiProperties.AirQuality config;

    public AirQualityApiClient(RestTemplate restTemplate, ExternalApiProperties apiProperties) {
        this.restTemplate = restTemplate;
        this.config = apiProperties.getAirQuality();
    }

    /**
     * Calls the external air quality provider for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return raw air quality data mapped into {@link AirQualityResponseDTO}
     */
    public AirQualityResponseDTO fetchAirQuality(double latitude, double longitude) {
        // TODO: Replace with a real call once an API key is provisioned, e.g.:
        //   String url = config.getBaseUrl() + "/air-quality?lat=" + latitude
        //       + "&lon=" + longitude + "&key=" + config.getApiKey();
        //   AirQualityRawResponse raw = restTemplate.getForObject(url, AirQualityRawResponse.class);
        //   return mapToDto(raw);
        throw new UnsupportedOperationException(
                "AirQualityApiClient.fetchAirQuality is not yet implemented - external API key required.");
    }
}
