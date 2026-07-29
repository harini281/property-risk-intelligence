package com.propertyrisk.service;

import com.propertyrisk.agents.GeocodingAgent;
import com.propertyrisk.dto.GeocodingResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class GeocodingServiceImpl implements GeocodingService {
    private final GeocodingAgent geocodingAgent;

    public GeocodingServiceImpl(GeocodingAgent geocodingAgent) {
        this.geocodingAgent = geocodingAgent;
    }

    @Override
    public GeocodingResponseDTO geocode(String address) {
        if (address == null || address.trim().length() < 3) {
            throw new IllegalArgumentException("Please provide an address, city, or postal code.");
        }
        return geocodingAgent.resolveAddress(address.trim());
    }
}
