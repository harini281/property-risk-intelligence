package com.propertyrisk.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;

/**
 * Centralized exception handling for all REST controllers.
 *
 * <p>Ensures every unhandled failure is returned to the client as a
 * consistent {@link ErrorResponse} JSON body rather than a raw stack
 * trace or the default Spring error page.</p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ErrorResponse> handleExternalApiException(ExternalApiException ex,
                                                                      HttpServletRequest request) {
        ErrorResponse body = buildBody(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), request);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex,
                                                                 HttpServletRequest request) {
        ErrorResponse body = buildBody(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unhandled request failure for {}", request.getRequestURI(), ex);
        ErrorResponse body = buildBody(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.", request);
        return ResponseEntity.internalServerError().body(body);
    }

    private ErrorResponse buildBody(HttpStatus status, String message, HttpServletRequest request) {
        return ErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();
    }
}
