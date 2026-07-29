package com.propertyrisk.agents.interfaces;

/**
 * Common contract for a domain-specific risk-gathering agent.
 *
 * <p>Each implementation is responsible for exactly one risk domain
 * (weather, flood, air quality, ...) and must never let an upstream
 * failure propagate as an unhandled exception - agents degrade
 * gracefully and report failure through the returned DTO instead.</p>
 *
 * @param <T> the structured response type produced by this agent
 */
public interface RiskAgent<T> {

    /**
     * Gathers risk data for the given coordinates.
     *
     * @param latitude  property latitude
     * @param longitude property longitude
     * @return structured, never-null result; failures are represented via
     *         a {@code success=false} flag on the DTO rather than a thrown exception
     */
    T fetchData(double latitude, double longitude);
}
