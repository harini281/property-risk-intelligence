package com.propertyrisk.service;

import com.propertyrisk.agents.PropertyRiskAgent;
import com.propertyrisk.auth.AuthContext;
import com.propertyrisk.auth.SupabaseJwtValidator;
import com.propertyrisk.dto.AirQualityResponseDTO;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.dto.PropertyRiskReportDTO;
import com.propertyrisk.dto.WeatherResponseDTO;
import com.propertyrisk.model.RiskLevel;
import com.propertyrisk.repository.PropertyRepository;
import com.propertyrisk.repository.ReportRepository;
import com.propertyrisk.repository.RiskAssessmentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;

@SpringBootTest
class PropertyRiskServicePersistenceTest {

    @Autowired
    private PropertyRiskServiceImpl propertyRiskService;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;

    @Autowired
    private ReportRepository reportRepository;

    @MockBean
    private PropertyRiskAgent propertyRiskAgent;

    @MockBean
    private AuthContext authContext;

    private static final UUID USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000123");

    @Test
    void persistsAssessmentAndReportForAuthenticatedUser() {
        when(authContext.currentUser()).thenReturn(new SupabaseJwtValidator.JwtClaims(USER_ID.toString(), "user@example.com"));
        when(propertyRiskAgent.assessPropertyRisk(anyDouble(), anyDouble())).thenReturn(sampleReport());

        propertyRiskService.getPropertyRisk(42.28, -83.74);

        assertThat(propertyRepository.count()).isEqualTo(1);
        assertThat(riskAssessmentRepository.count()).isEqualTo(1);
        assertThat(reportRepository.count()).isEqualTo(1);

        var assessment = riskAssessmentRepository.findAll().get(0);
        var report = reportRepository.findAll().get(0);

        assertThat(assessment.getUserId()).isEqualTo(USER_ID);
        assertThat(report.getUserId()).isEqualTo(USER_ID);
    }

    @Test
    void doesNotDuplicateAssessmentOrReportForSameUserAndProperty() {
        when(authContext.currentUser()).thenReturn(new SupabaseJwtValidator.JwtClaims(USER_ID.toString(), "user@example.com"));
        when(propertyRiskAgent.assessPropertyRisk(anyDouble(), anyDouble())).thenReturn(sampleReport());

        propertyRiskService.getPropertyRisk(42.28, -83.74);
        propertyRiskService.getPropertyRisk(42.28, -83.74);

        assertThat(propertyRepository.count()).isEqualTo(1);
        assertThat(riskAssessmentRepository.count()).isEqualTo(1);
        assertThat(reportRepository.count()).isEqualTo(1);
    }

    private PropertyRiskReportDTO sampleReport() {
        return PropertyRiskReportDTO.builder()
                .latitude(42.28)
                .longitude(-83.74)
                .overallRiskLevel(RiskLevel.MEDIUM)
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
                        .floodRiskLevel(RiskLevel.LOW)
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
}
