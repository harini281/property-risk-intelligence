package com.propertyrisk.model;

/**
 * Represents the severity of a risk signal (weather, flood, air quality,
 * or the aggregated overall property risk).
 */
public enum RiskLevel {
    LOW,
    MEDIUM,
    HIGH,

    /**
     * Used when an underlying data source failed and no reliable
     * risk determination could be made.
     */
    UNKNOWN
}
