package com.propertyrisk.service;

import com.propertyrisk.agents.PropertyRiskAgent;
import com.propertyrisk.auth.AuthContext;
import com.propertyrisk.dto.PropertyRiskReportDTO;
import org.springframework.stereotype.Service;

/**
 * Default {@link PropertyRiskService} implementation delegating to
 * {@link PropertyRiskAgent}.
 *
 * <p>TODO: Once {@code RiskAssessmentRepository} persistence is wired in,
 * persist each generated report here for historical trend queries.</p>
 */
@Service
public class PropertyRiskServiceImpl implements PropertyRiskService {

    private final PropertyRiskAgent propertyRiskAgent;
    private final AuthContext authContext;
    private final UserPersistenceService userPersistenceService;

    public PropertyRiskServiceImpl(PropertyRiskAgent propertyRiskAgent,
                                   AuthContext authContext,
                                   UserPersistenceService userPersistenceService) {
        this.propertyRiskAgent = propertyRiskAgent;
        this.authContext = authContext;
        this.userPersistenceService = userPersistenceService;
    }

    @Override
    public PropertyRiskReportDTO getPropertyRisk(double latitude, double longitude) {
        PropertyRiskReportDTO report = propertyRiskAgent.assessPropertyRisk(latitude, longitude);
        var currentUser = authContext.currentUser();
        if (currentUser != null && currentUser.subject() != null) {
            userPersistenceService.persistAssessment(currentUser.subject(), latitude, longitude, report);
        }
        return report;
    }
}
