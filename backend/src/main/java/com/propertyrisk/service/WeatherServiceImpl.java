package com.propertyrisk.service;

import com.propertyrisk.agents.WeatherAgent;
import com.propertyrisk.dto.WeatherResponseDTO;
import org.springframework.stereotype.Service;

/**
 * Default {@link WeatherService} implementation delegating to
 * {@link WeatherAgent}.
 */
@Service
public class WeatherServiceImpl implements WeatherService {

    private final WeatherAgent weatherAgent;

    public WeatherServiceImpl(WeatherAgent weatherAgent) {
        this.weatherAgent = weatherAgent;
    }

    @Override
    public WeatherResponseDTO getWeather(double latitude, double longitude) {
        return weatherAgent.fetchData(latitude, longitude);
    }
}
