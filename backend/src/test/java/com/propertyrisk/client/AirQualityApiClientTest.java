package com.propertyrisk.client;

import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.AirQualityResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import org.springframework.http.HttpMethod;

class AirQualityApiClientTest {

  @Test
  void fetchAirQualityMapsOpenMeteoPayload() {
    RestTemplate restTemplate = new RestTemplate();
    MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
    server.expect(requestTo(org.hamcrest.Matchers.containsString("/v1/air-quality")))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess("""
            {
              "current": {
                "us_aqi": 58,
                "pm2_5": 15.4,
                "pm10": 22.2
              }
            }
            """, MediaType.APPLICATION_JSON));

    ExternalApiProperties properties = new ExternalApiProperties();
    properties.getAirQuality().setBaseUrl("https://air-quality-api.open-meteo.com");

    AirQualityApiClient client = new AirQualityApiClient(restTemplate, properties);
    AirQualityResponseDTO response = client.fetchAirQuality(33.0, -84.0);

    assertTrue(response.isSuccess());
    assertEquals(58, response.getAqi());
    assertEquals("PM10", response.getDominantPollutant());
    assertEquals("Moderate", response.getHealthCategory());
  }
}
