package com.propertyrisk.exception;

/**
 * Thrown when a call to an external data source (weather, flood, or air
 * quality provider) fails or returns an unusable response.
 *
 * <p>Agents catch this internally where graceful degradation is required;
 * it is only allowed to propagate to the {@code GlobalExceptionHandler}
 * when no fallback is possible.</p>
 */
public class ExternalApiException extends RuntimeException {

    public ExternalApiException(String message) {
        super(message);
    }

    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
