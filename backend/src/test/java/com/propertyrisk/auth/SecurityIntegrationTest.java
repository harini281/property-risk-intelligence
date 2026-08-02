package com.propertyrisk.auth;

import com.propertyrisk.dto.AirQualityResponseDTO;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.dto.PropertyRiskReportDTO;
import com.propertyrisk.dto.WeatherResponseDTO;
import com.propertyrisk.service.PropertyRiskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyRiskService propertyRiskService;

    @Value("${supabase.jwt.secret:changeme}")
    private String jwtSecret;

    @Test
    void healthEndpointIsPublic() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk());
    }

    @Test
    void protectedEndpointRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/property-risk")
                .param("latitude", "42.28")
                .param("longitude", "-83.74"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointAcceptsValidToken() throws Exception {
        when(propertyRiskService.getPropertyRisk(anyDouble(), anyDouble())).thenReturn(sampleReport());

        mockMvc.perform(get("/api/property-risk")
                .param("latitude", "42.28")
                .param("longitude", "-83.74")
                .header(HttpHeaders.AUTHORIZATION,
                        "Bearer " + createSignedToken(jwtSecret, "user-123", "user@example.com")))
                .andExpect(status().isOk());
    }

    private PropertyRiskReportDTO sampleReport() {
        return PropertyRiskReportDTO.builder()
                .latitude(42.28)
                .longitude(-83.74)
                .overallRiskLevel(com.propertyrisk.model.RiskLevel.LOW)
                .generatedAt(Instant.now())
                .weather(WeatherResponseDTO.builder()
                        .temperatureCelsius(21.0)
                        .humidityPercent(50.0)
                        .windSpeedKph(12.0)
                        .condition("Partly Cloudy")
                        .location("Ann Arbor")
                        .success(true)
                        .message("sample")
                        .build())
                .flood(FloodRiskResponseDTO.builder()
                        .floodRiskLevel(com.propertyrisk.model.RiskLevel.LOW)
                        .floodZone("Zone X")
                        .activeWarnings(java.util.List.of())
                        .success(true)
                        .message("sample")
                        .build())
                .airQuality(AirQualityResponseDTO.builder()
                        .aqi(42)
                        .dominantPollutant("PM2.5")
                        .healthCategory("Good")
                        .success(true)
                        .message("sample")
                        .build())
                .build();
    }

    private String createSignedToken(String secret, String subject, String email) throws Exception {
        long now = Instant.now().getEpochSecond();
        String header = base64UrlEncode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = base64UrlEncode("{\"sub\":\"" + subject + "\",\"email\":\"" + email + "\",\"iat\":" + now
                + ",\"exp\":" + (now + 3600) + "}");
        String signingInput = header + "." + payload;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return signingInput + "." + base64UrlEncode(mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8)));
    }

    private String base64UrlEncode(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String base64UrlEncode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }
}
