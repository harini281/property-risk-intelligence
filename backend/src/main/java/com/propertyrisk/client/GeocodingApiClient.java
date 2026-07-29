package com.propertyrisk.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.GeocodingResponseDTO;
import com.propertyrisk.exception.ExternalApiException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

/** Low-level client for translating an entered address into coordinates. */
@Component
public class GeocodingApiClient {

    private final RestTemplate restTemplate;
    private final ExternalApiProperties.Geocoding config;

    public GeocodingApiClient(RestTemplate restTemplate, ExternalApiProperties properties) {
        this.restTemplate = restTemplate;
        this.config = properties.getGeocoding();
    }

    public GeocodingResponseDTO geocode(String address) {
        String url = UriComponentsBuilder.fromUriString(config.getBaseUrl().replaceAll("/+$", ""))
                .path("/search")
                .queryParam("q", address)
                .queryParam("format", "jsonv2")
                .queryParam("limit", 1)
                .build()
                .encode()
                .toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, config.getUserAgent());
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            JsonNode results = response.getBody();
            if (results == null || !results.isArray() || results.isEmpty()) {
                return GeocodingResponseDTO.builder().success(false)
                        .message("No location was found for that address.").build();
            }
            JsonNode result = results.get(0);
            return GeocodingResponseDTO.builder()
                    .displayName(result.path("display_name").asText())
                    .latitude(result.path("lat").asDouble())
                    .longitude(result.path("lon").asDouble())
                    .success(true)
                    .message("Address geocoded successfully.")
                    .build();
        } catch (Exception ex) {
            throw new ExternalApiException("Unable to geocode the supplied address.", ex);
        }
    }
}
