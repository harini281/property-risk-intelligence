package com.propertyrisk.controller;

import com.propertyrisk.dto.PropertyRiskReportDTO;
import com.propertyrisk.service.PropertyRiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes the combined property risk report, aggregating weather, flood,
 * and air quality signals into a single overall risk level.
 */
@RestController
public class PropertyRiskController {

    private final PropertyRiskService propertyRiskService;

    public PropertyRiskController(PropertyRiskService propertyRiskService) {
        this.propertyRiskService = propertyRiskService;
    }

    /**
     * Retrieves a combined property risk report for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return {@link PropertyRiskReportDTO} wrapped in a 200 OK response
     */
    @GetMapping("/api/property-risk")
    public ResponseEntity<PropertyRiskReportDTO> getPropertyRisk(@RequestParam double latitude,
                                                                   @RequestParam double longitude) {
        PropertyRiskReportDTO response = propertyRiskService.getPropertyRisk(latitude, longitude);
        return ResponseEntity.ok(response);
    }
}
