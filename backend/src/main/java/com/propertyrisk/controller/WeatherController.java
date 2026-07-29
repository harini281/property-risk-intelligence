package com.propertyrisk.controller;

import com.propertyrisk.dto.WeatherResponseDTO;
import com.propertyrisk.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes weather data for a property location.
 */
@RestController
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    /**
     * Retrieves current weather conditions for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return {@link WeatherResponseDTO} wrapped in a 200 OK response
     */
    @GetMapping("/api/weather")
    public ResponseEntity<WeatherResponseDTO> getWeather(@RequestParam double latitude,
                                                           @RequestParam double longitude) {
        WeatherResponseDTO response = weatherService.getWeather(latitude, longitude);
        return ResponseEntity.ok(response);
    }
}
