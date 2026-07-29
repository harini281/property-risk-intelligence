package com.propertyrisk.service;

import com.propertyrisk.agents.FloodRiskAgent;
import com.propertyrisk.dto.FloodRiskResponseDTO;
import org.springframework.stereotype.Service;

/**
 * Default {@link FloodRiskService} implementation delegating to
 * {@link FloodRiskAgent}.
 */
@Service
public class FloodRiskServiceImpl implements FloodRiskService {

    private final FloodRiskAgent floodRiskAgent;

    public FloodRiskServiceImpl(FloodRiskAgent floodRiskAgent) {
        this.floodRiskAgent = floodRiskAgent;
    }

    @Override
    public FloodRiskResponseDTO getFloodRisk(double latitude, double longitude) {
        return floodRiskAgent.fetchData(latitude, longitude);
    }
}
