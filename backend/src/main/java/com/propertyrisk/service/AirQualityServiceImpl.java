package com.propertyrisk.service;

import com.propertyrisk.agents.AirQualityAgent;
import com.propertyrisk.dto.AirQualityResponseDTO;
import org.springframework.stereotype.Service;

/**
 * Default {@link AirQualityService} implementation delegating to
 * {@link AirQualityAgent}.
 */
@Service
public class AirQualityServiceImpl implements AirQualityService {

    private final AirQualityAgent airQualityAgent;

    public AirQualityServiceImpl(AirQualityAgent airQualityAgent) {
        this.airQualityAgent = airQualityAgent;
    }

    @Override
    public AirQualityResponseDTO getAirQuality(double latitude, double longitude) {
        return airQualityAgent.fetchData(latitude, longitude);
    }
}
