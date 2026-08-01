package com.propertyrisk.client;

import com.propertyrisk.config.ExternalApiProperties;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.model.RiskLevel;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class FloodApiClientTest {

    @Test
    void fetchFloodRiskMapsRiskClassification() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo(org.hamcrest.Matchers.containsString("/flood")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        {
                          "properties": {
                            "floodZone": "Zone X",
                            "riskLevel": "HIGH",
                            "warnings": ["Flash flood warning"]
                          }
                        }
                        """, MediaType.APPLICATION_JSON));

        ExternalApiProperties properties = new ExternalApiProperties();
        properties.getFlood().setBaseUrl("https://example.com");

        FloodApiClient client = new FloodApiClient(restTemplate, properties);
        FloodRiskResponseDTO response = client.fetchFloodRisk(33.0, -84.0);

        assertTrue(response.isSuccess());
        assertEquals(RiskLevel.HIGH, response.getFloodRiskLevel());
        assertEquals("Zone X", response.getFloodZone());
        assertEquals(1, response.getActiveWarnings().size());
    }
}
