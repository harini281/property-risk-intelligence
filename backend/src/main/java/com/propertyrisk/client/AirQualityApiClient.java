package com.propertyrisk.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.AirQualityResponseDTO;
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

/**
 * Low-level HTTP client responsible for calling an external air quality
 * data provider (e.g. Open-Meteo).
 *
 * <p>
 * Owns only the raw HTTP call and response mapping; risk interpretation
 * lives in {@code AirQualityAgent}.
 * </p>
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
        String url = UriComponentsBuilder.fromUriString(config.getBaseUrl().replaceAll("/+$", ""))
                .path("/v1/air-quality")
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("current", "us_aqi,pm2_5,pm10")
                .build()
                .encode()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            JsonNode body = response.getBody();
            if (!response.getStatusCode().is2xxSuccessful() || body == null || body.path("current").isMissingNode()) {
                throw new ExternalApiException("Air quality service returned an unavailable response.");
            }

            JsonNode current = body.path("current");
            Integer aqi = current.path("us_aqi").isNumber() ? current.path("us_aqi").asInt() : null;
            Double pm25 = current.path("pm2_5").isNumber() ? current.path("pm2_5").asDouble() : null;
            Double pm10 = current.path("pm10").isNumber() ? current.path("pm10").asDouble() : null;
            String dominantPollutant = determineDominantPollutant(pm25, pm10);
            String healthCategory = classifyHealthCategory(aqi);

            return AirQualityResponseDTO.builder()
                    .aqi(aqi)
                    .dominantPollutant(dominantPollutant)
                    .healthCategory(healthCategory)
                    .success(true)
                    .message("Live air quality index")
                    .build();
        } catch (ExternalApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ExternalApiException("Unable to retrieve live air quality data.", ex);
        }
    }

    private String determineDominantPollutant(Double pm25, Double pm10) {
        if (pm25 != null && pm10 != null) {
            return pm25 >= pm10 ? "PM2.5" : "PM10";
        }
        if (pm25 != null) {
            return "PM2.5";
        }
        if (pm10 != null) {
            return "PM10";
        }
        return "Unknown";
    }

    private String classifyHealthCategory(Integer aqi) {
        if (aqi == null) {
            return "Unknown";
        }
        if (aqi <= 50) {
            return "Good";
        }
        if (aqi <= 100) {
            return "Moderate";
        }
        if (aqi <= 150) {
            return "Unhealthy for Sensitive Groups";
        }
        if (aqi <= 200) {
            return "Unhealthy";
        }
        if (aqi <= 300) {
            return "Very Unhealthy";
        }
        return "Hazardous";
    }
}
