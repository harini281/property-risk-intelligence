package com.propertyrisk.service;

import com.propertyrisk.dto.GeocodingResponseDTO;

public interface GeocodingService {
    GeocodingResponseDTO geocode(String address);
}
