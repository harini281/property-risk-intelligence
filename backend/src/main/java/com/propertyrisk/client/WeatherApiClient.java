package com.propertyrisk.client;

import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.WeatherResponseDTO;
import com.propertyrisk.exception.ExternalApiException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Low-level HTTP client responsible for calling the external weather data
 * provider (e.g. OpenWeatherMap, WeatherAPI, NOAA).
 *
 * <p>This class owns only the raw HTTP call and response mapping. Business
 * logic (risk interpretation, fallback behavior) lives in
 * {@code WeatherAgent}, keeping a single responsibility per class.</p>
 */
@Component
public class WeatherApiClient {

    private static final Pattern WIND_SPEED_PATTERN = Pattern.compile("([0-9]+(?:\\.[0-9]+)?)");

    private final RestTemplate restTemplate;
    private final ExternalApiProperties.Weather config;

    public WeatherApiClient(RestTemplate restTemplate, ExternalApiProperties apiProperties) {
        this.restTemplate = restTemplate;
        this.config = apiProperties.getWeather();
    }

    /**
     * Calls the external weather provider for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return raw weather data mapped into {@link WeatherResponseDTO}
     */
    public WeatherResponseDTO fetchWeather(double latitude, double longitude) {
        String pointsUrl = normalizedBaseUrl() + "/points/" + latitude + "," + longitude;
        JsonNode point = getJson(pointsUrl);
        JsonNode properties = point.path("properties");
        String forecastHourlyUrl = properties.path("forecastHourly").asText();
        if (forecastHourlyUrl.isBlank()) {
            throw new ExternalApiException("NOAA does not provide a forecast for this location.");
        }

        JsonNode periods = getJson(forecastHourlyUrl).path("properties").path("periods");
        if (!periods.isArray() || periods.isEmpty()) {
            throw new ExternalApiException("NOAA returned no hourly forecast periods for this location.");
        }

        JsonNode current = periods.get(0);
        double fahrenheit = current.path("temperature").asDouble(Double.NaN);
        if (Double.isNaN(fahrenheit)) {
            throw new ExternalApiException("NOAA returned an incomplete temperature reading.");
        }

        JsonNode relativeLocation = properties.path("relativeLocation").path("properties");
        String city = relativeLocation.path("city").asText("");
        String state = relativeLocation.path("state").asText("");
        String location = city.isBlank() ? "Coordinates " + latitude + ", " + longitude
                : city + (state.isBlank() ? "" : ", " + state);

        return WeatherResponseDTO.builder()
                .temperatureCelsius(round((fahrenheit - 32) * 5 / 9))
                .humidityPercent(current.path("relativeHumidity").path("value").isNumber()
                        ? current.path("relativeHumidity").path("value").asDouble() : null)
                .windSpeedKph(parseWindKph(current.path("windSpeed").asText()))
                .condition(current.path("shortForecast").asText("Unavailable"))
                .location(location)
                .success(true)
                .message("Live NOAA/NWS hourly forecast")
                .build();
    }

    private JsonNode getJson(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, config.getUserAgent());
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new ExternalApiException("NOAA returned an unavailable response.");
            }
            return response.getBody();
        } catch (ExternalApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ExternalApiException("Unable to retrieve live NOAA weather data.", ex);
        }
    }

    private String normalizedBaseUrl() {
        return config.getBaseUrl().replaceAll("/+$", "");
    }

    private Double parseWindKph(String windSpeed) {
        Matcher matcher = WIND_SPEED_PATTERN.matcher(windSpeed);
        if (!matcher.find()) return null;
        double mph = Double.parseDouble(matcher.group(1));
        return round(mph * 1.60934);
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
