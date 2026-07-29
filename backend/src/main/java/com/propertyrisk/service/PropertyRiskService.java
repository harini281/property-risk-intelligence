package com.propertyrisk.service;

import com.propertyrisk.dto.PropertyRiskReportDTO;

/**
 * Application service exposing the combined property risk report to the
 * controller layer.
 */
public interface PropertyRiskService {

    /**
     * Produces a combined property risk report for the given coordinates,
     * aggregating weather, flood, and air quality signals.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return combined property risk report
     */
    PropertyRiskReportDTO getPropertyRisk(double latitude, double longitude);
}
