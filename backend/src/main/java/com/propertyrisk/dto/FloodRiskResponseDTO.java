package com.propertyrisk.dto;

import com.propertyrisk.model.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Structured flood risk data returned by {@code FloodRiskAgent}.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloodRiskResponseDTO {

    private RiskLevel floodRiskLevel;
    private String floodZone;
    private List<String> activeWarnings;

    /** Whether the underlying external call succeeded. */
    private boolean success;

    /** Human-readable status or error detail. */
    private String message;
}
