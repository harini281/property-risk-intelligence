package com.propertyrisk.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Type-safe binding for external data provider configuration, sourced from
 * {@code application.yml} under the {@code external-api} prefix.
 *
 * <p>Values are left blank in configuration until real API keys are
 * provisioned. See TODOs in {@code client} package classes.</p>
 */
@Configuration
@ConfigurationProperties(prefix = "external-api")
@Getter
@Setter
public class ExternalApiProperties {

    private final Weather weather = new Weather();
    private final Flood flood = new Flood();
    private final AirQuality airQuality = new AirQuality();
    private final Geocoding geocoding = new Geocoding();

    @Getter
    @Setter
    public static class Weather {
        private String baseUrl;
        private String userAgent;
    }

    @Getter
    @Setter
    public static class Flood {
        private String baseUrl;
        private String apiKey;
    }

    @Getter
    @Setter
    public static class AirQuality {
        private String baseUrl;
        private String apiKey;
    }

    @Getter
    @Setter
    public static class Geocoding {
        private String baseUrl;
        private String userAgent;
    }
}
