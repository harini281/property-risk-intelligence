package com.propertyrisk.controller;

import com.propertyrisk.dto.AirQualityResponseDTO;
import com.propertyrisk.service.AirQualityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes air quality data for a property location.
 */
@RestController
public class AirQualityController {

    private final AirQualityService airQualityService;

    public AirQualityController(AirQualityService airQualityService) {
        this.airQualityService = airQualityService;
    }

    /**
     * Retrieves air quality information for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return {@link AirQualityResponseDTO} wrapped in a 200 OK response
     */
    @GetMapping("/api/air-quality")
    public ResponseEntity<AirQualityResponseDTO> getAirQuality(@RequestParam double latitude,
                                                                 @RequestParam double longitude) {
        AirQualityResponseDTO response = airQualityService.getAirQuality(latitude, longitude);
        return ResponseEntity.ok(response);
    }
}
