package com.propertyrisk.util;

import com.propertyrisk.dto.AirQualityResponseDTO;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import com.propertyrisk.dto.WeatherResponseDTO;
import com.propertyrisk.model.RiskLevel;

/**
 * Stateless utility for deriving an overall {@link RiskLevel} from the
 * individual weather, flood, and air quality signals.
 *
 * <p>Kept outside of {@code PropertyRiskAgent} so the scoring rules can be
 * unit-tested and evolved independently of agent coordination logic
 * (Single Responsibility Principle).</p>
 */
public final class RiskCalculator {

    private static final int AQI_HIGH_THRESHOLD = 150;
    private static final int AQI_MEDIUM_THRESHOLD = 100;

    private RiskCalculator() {
        // Utility class - no instances.
    }

    /**
     * Combines flood risk, air quality, and weather signals into a single
     * overall {@link RiskLevel}.
     *
     * <p>Current rule: the overall risk is the highest individual risk
     * level among the three domains. Weather contributes a conservative
     * classification based on live wind speed and temperature.</p>
     *
     * @param weather    weather signal (currently informational only)
     * @param flood      flood risk signal
     * @param airQuality air quality signal
     * @return the aggregated overall risk level
     */
    public static RiskLevel calculateOverallRisk(WeatherResponseDTO weather,
                                                   FloodRiskResponseDTO flood,
                                                   AirQualityResponseDTO airQuality) {
        RiskLevel floodRisk = flood != null && flood.isSuccess()
                ? flood.getFloodRiskLevel()
                : RiskLevel.UNKNOWN;

        RiskLevel airQualityRisk = classifyAirQuality(airQuality);
        RiskLevel weatherRisk = classifyWeather(weather);

        return highestOf(highestOf(floodRisk, airQualityRisk), weatherRisk);
    }

    private static RiskLevel classifyAirQuality(AirQualityResponseDTO airQuality) {
        if (airQuality == null || !airQuality.isSuccess() || airQuality.getAqi() == null) {
            return RiskLevel.UNKNOWN;
        }
        int aqi = airQuality.getAqi();
        if (aqi >= AQI_HIGH_THRESHOLD) {
            return RiskLevel.HIGH;
        }
        if (aqi >= AQI_MEDIUM_THRESHOLD) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }

    private static RiskLevel classifyWeather(WeatherResponseDTO weather) {
        if (weather == null || !weather.isSuccess()) {
            return RiskLevel.UNKNOWN;
        }
        double wind = weather.getWindSpeedKph() == null ? 0 : weather.getWindSpeedKph();
        double temperature = weather.getTemperatureCelsius() == null ? 20 : weather.getTemperatureCelsius();
        if (wind >= 90 || temperature >= 40 || temperature <= -25) return RiskLevel.HIGH;
        if (wind >= 60 || temperature >= 35 || temperature <= -15) return RiskLevel.MEDIUM;
        return RiskLevel.LOW;
    }

    private static RiskLevel highestOf(RiskLevel a, RiskLevel b) {
        return severity(a) >= severity(b) ? a : b;
    }

    private static int severity(RiskLevel level) {
        if (level == null) {
            return -1;
        }
        return switch (level) {
            case HIGH -> 3;
            case MEDIUM -> 2;
            case LOW -> 1;
            case UNKNOWN -> 0;
        };
    }
}
