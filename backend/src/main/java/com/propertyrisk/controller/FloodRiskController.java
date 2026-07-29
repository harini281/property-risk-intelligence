package com.propertyrisk.controller;

import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.service.FloodRiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes flood risk data for a property location.
 */
@RestController
public class FloodRiskController {

    private final FloodRiskService floodRiskService;

    public FloodRiskController(FloodRiskService floodRiskService) {
        this.floodRiskService = floodRiskService;
    }

    /**
     * Retrieves flood risk information for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return {@link FloodRiskResponseDTO} wrapped in a 200 OK response
     */
    @GetMapping("/api/flood")
    public ResponseEntity<FloodRiskResponseDTO> getFloodRisk(@RequestParam double latitude,
                                                               @RequestParam double longitude) {
        FloodRiskResponseDTO response = floodRiskService.getFloodRisk(latitude, longitude);
        return ResponseEntity.ok(response);
    }
}
