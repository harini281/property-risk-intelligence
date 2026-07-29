package com.propertyrisk.agents;

import com.propertyrisk.client.GeocodingApiClient;
import com.propertyrisk.dto.GeocodingResponseDTO;
import org.springframework.stereotype.Component;

/** Agent boundary for address resolution; it keeps controllers API-client agnostic. */
@Component
public class GeocodingAgent {
    private final GeocodingApiClient geocodingApiClient;

    public GeocodingAgent(GeocodingApiClient geocodingApiClient) {
        this.geocodingApiClient = geocodingApiClient;
    }

    public GeocodingResponseDTO resolveAddress(String address) {
        return geocodingApiClient.geocode(address);
    }
}
