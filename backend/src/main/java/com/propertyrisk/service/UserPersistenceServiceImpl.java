package com.propertyrisk.service;

import com.propertyrisk.dto.PropertyRiskReportDTO;
import com.propertyrisk.model.Property;
import com.propertyrisk.model.Report;
import com.propertyrisk.model.RiskAssessment;
import com.propertyrisk.model.SavedProperty;
import com.propertyrisk.repository.PropertyRepository;
import com.propertyrisk.repository.ReportRepository;
import com.propertyrisk.repository.RiskAssessmentRepository;
import com.propertyrisk.repository.SavedPropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UserPersistenceServiceImpl implements UserPersistenceService {

    private final PropertyRepository propertyRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ReportRepository reportRepository;
    private final SavedPropertyRepository savedPropertyRepository;

    public UserPersistenceServiceImpl(PropertyRepository propertyRepository,
            RiskAssessmentRepository riskAssessmentRepository,
            ReportRepository reportRepository,
            SavedPropertyRepository savedPropertyRepository) {
        this.propertyRepository = propertyRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.reportRepository = reportRepository;
        this.savedPropertyRepository = savedPropertyRepository;
    }

    @Override
    @Transactional
    public void persistAssessment(String userId, double latitude, double longitude, PropertyRiskReportDTO report) {
        if (userId == null || userId.isBlank()) {
            return;
        }

        Property property = propertyRepository.findByLatitudeAndLongitude(latitude, longitude)
                .orElseGet(() -> {
                    Property newProperty = Property.builder()
                            .address(buildAddress(latitude, longitude))
                            .latitude(latitude)
                            .longitude(longitude)
                            .build();
                    return propertyRepository.save(newProperty);
                });

        Optional<RiskAssessment> existing = riskAssessmentRepository.findByUserIdAndPropertyIdAndGeneratedAt(userId,
                property.getId(), report.getGeneratedAt());
        if (existing.isPresent()) {
            return;
        }

        RiskAssessment assessment = RiskAssessment.builder()
                .userId(userId)
                .property(property)
                .overallRiskLevel(report.getOverallRiskLevel())
                .generatedAt(report.getGeneratedAt() != null ? report.getGeneratedAt() : Instant.now())
                .build();
        riskAssessmentRepository.save(assessment);

        Report persistedReport = Report.builder()
                .userId(userId)
                .address(property.getAddress())
                .reportType("homeowner")
                .riskScore(mapRiskLevelToScore(report.getOverallRiskLevel()))
                .summary(buildSummary(report))
                .status("completed")
                .createdAt(Instant.now())
                .build();
        reportRepository.save(persistedReport);
    }

    @Override
    public List<RiskAssessment> getMyRiskAssessments(String userId) {
        return riskAssessmentRepository.findByUserIdOrderByGeneratedAtDesc(userId);
    }

    @Override
    public List<Report> getMyReports(String userId) {
        return reportRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<SavedProperty> getSavedProperties(String userId) {
        return savedPropertyRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public SavedProperty saveProperty(String userId, String address, Integer riskScore, String notes) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId is required");
        }
        Optional<SavedProperty> existing = savedPropertyRepository.findByUserIdAndAddress(userId, address);
        if (existing.isPresent()) {
            return existing.get();
        }
        SavedProperty entity = SavedProperty.builder()
                .userId(userId)
                .address(address)
                .riskScore(riskScore)
                .notes(notes)
                .createdAt(Instant.now())
                .build();
        return savedPropertyRepository.save(entity);
    }

    private String buildAddress(double latitude, double longitude) {
        return String.format("%.5f, %.5f", latitude, longitude);
    }

    private String buildSummary(PropertyRiskReportDTO report) {
        if (report == null) {
            return "Property risk assessment completed.";
        }
        return String.format("Overall risk level %s with weather %s, flood %s, and air quality %s.",
                report.getOverallRiskLevel(),
                report.getWeather() != null ? report.getWeather().getCondition() : "n/a",
                report.getFlood() != null ? report.getFlood().getFloodZone() : "n/a",
                report.getAirQuality() != null ? report.getAirQuality().getHealthCategory() : "n/a");
    }

    private int mapRiskLevelToScore(com.propertyrisk.model.RiskLevel riskLevel) {
        return switch (riskLevel) {
            case LOW -> 25;
            case MEDIUM -> 60;
            case HIGH -> 85;
            case UNKNOWN -> 50;
        };
    }
}
