package com.propertyrisk.controller;

import com.propertyrisk.dto.GeocodingResponseDTO;
import com.propertyrisk.service.GeocodingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Exposes address search to the React application. */
@RestController
public class GeocodingController {
    private final GeocodingService geocodingService;

    public GeocodingController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/api/geocode")
    public ResponseEntity<GeocodingResponseDTO> geocode(@RequestParam String address) {
        return ResponseEntity.ok(geocodingService.geocode(address));
    }
}
