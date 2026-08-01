package com.propertyrisk.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.exception.ExternalApiException;
import com.propertyrisk.model.RiskLevel;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * Low-level HTTP client responsible for calling an external flood data
 * provider (e.g. Open-Meteo flood-risk proxy endpoint).
 *
 * <p>
 * Owns only the raw HTTP call and response mapping; risk interpretation
 * lives in {@code FloodRiskAgent}.
 * </p>
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
        String url = UriComponentsBuilder.fromUriString(config.getBaseUrl().replaceAll("/+$", ""))
                .path("/flood")
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .build()
                .encode()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            JsonNode body = response.getBody();
            if (!response.getStatusCode().is2xxSuccessful() || body == null
                    || body.path("properties").isMissingNode()) {
                throw new ExternalApiException("Flood service returned an unavailable response.");
            }

            JsonNode properties = body.path("properties");
            String zone = properties.path("floodZone").asText("Unknown");
            String riskLevel = properties.path("riskLevel").asText("LOW");
            JsonNode warningsNode = properties.path("warnings");
            List<String> warnings = new ArrayList<>();
            if (warningsNode.isArray()) {
                for (JsonNode warning : warningsNode) {
                    warnings.add(warning.asText());
                }
            }

            return FloodRiskResponseDTO.builder()
                    .floodRiskLevel(parseRiskLevel(riskLevel))
                    .floodZone(zone)
                    .activeWarnings(warnings)
                    .success(true)
                    .message("Live flood-risk assessment")
                    .build();
        } catch (ExternalApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ExternalApiException("Unable to retrieve live flood risk data.", ex);
        }
    }

    private RiskLevel parseRiskLevel(String riskLevel) {
        return switch (riskLevel.toUpperCase()) {
            case "HIGH" -> RiskLevel.HIGH;
            case "MEDIUM" -> RiskLevel.MEDIUM;
            case "LOW" -> RiskLevel.LOW;
            default -> RiskLevel.UNKNOWN;
        };
    }
}
