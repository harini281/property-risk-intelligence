package com.propertyrisk.service;

import com.propertyrisk.agents.PropertyRiskAgent;
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

    public PropertyRiskServiceImpl(PropertyRiskAgent propertyRiskAgent) {
        this.propertyRiskAgent = propertyRiskAgent;
    }

    @Override
    public PropertyRiskReportDTO getPropertyRisk(double latitude, double longitude) {
        return propertyRiskAgent.assessPropertyRisk(latitude, longitude);
    }
}
