package com.propertyrisk.service;

import com.propertyrisk.dto.PropertyRiskReportDTO;
import com.propertyrisk.model.Report;
import com.propertyrisk.model.RiskAssessment;
import com.propertyrisk.model.SavedProperty;

import java.util.List;

public interface UserPersistenceService {

    void persistAssessment(String userId, double latitude, double longitude, PropertyRiskReportDTO report);

    List<RiskAssessment> getMyRiskAssessments(String userId);

    List<Report> getMyReports(String userId);

    List<SavedProperty> getSavedProperties(String userId);

    SavedProperty saveProperty(String userId, String address, Integer riskScore, String notes);
}
