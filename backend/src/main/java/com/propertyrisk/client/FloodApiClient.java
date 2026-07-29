package com.propertyrisk.client;

import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Low-level HTTP client responsible for calling an external flood data
 * provider (e.g. FEMA National Flood Hazard Layer, NOAA).
 *
 * <p>Owns only the raw HTTP call and response mapping; risk interpretation
 * lives in {@code FloodRiskAgent}.</p>
 */
@Component
public class FloodApiClient {

    private final RestTemplate restTemplate;
    private final ExternalApiProperties.Flood config;

    public FloodApiClient(RestTemplate restTemplate, ExternalApiProperties apiProperties) {
        this.restTemplate = restTemplate;
        this.config = apiProperties.getFlood();
    }

    /**
     * Calls the external flood data provider for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return raw flood risk data mapped into {@link FloodRiskResponseDTO}
     */
    public FloodRiskResponseDTO fetchFloodRisk(double latitude, double longitude) {
        // TODO: Replace with a real call once an API key/endpoint is provisioned, e.g.:
        //   String url = config.getBaseUrl() + "/flood-zones?lat=" + latitude
        //       + "&lon=" + longitude + "&key=" + config.getApiKey();
        //   FemaRawResponse raw = restTemplate.getForObject(url, FemaRawResponse.class);
        //   return mapToDto(raw);
        throw new UnsupportedOperationException(
                "FloodApiClient.fetchFloodRisk is not yet implemented - external API key required.");
    }
}
