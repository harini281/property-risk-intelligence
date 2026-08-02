package com.propertyrisk.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Component
public class SupabaseJwtValidator {

    private final byte[] secretKey;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SupabaseJwtValidator(@Value("${supabase.jwt.secret:changeme}") String secret) {
        this.secretKey = secret.getBytes(StandardCharsets.UTF_8);
    }

    public JwtClaims validate(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return null;
        }

        String headerSegment = parts[0];
        String payloadSegment = parts[1];
        String signatureSegment = parts[2];

        String signingInput = headerSegment + "." + payloadSegment;
        byte[] expectedSignature = hmacSha256Bytes(signingInput);
        byte[] tokenSignature = Base64.getUrlDecoder().decode(signatureSegment);
        if (!MessageDigest.isEqual(expectedSignature, tokenSignature)) {
            return null;
        }

        try {
            Map<String, Object> payload = objectMapper.readValue(decodeSegment(payloadSegment), Map.class);
            Number exp = (Number) payload.get("exp");
            if (exp != null && Instant.now().getEpochSecond() > exp.longValue()) {
                return null;
            }
            String sub = (String) payload.get("sub");
            String email = (String) payload.get("email");
            return new JwtClaims(sub, email);
        } catch (JsonProcessingException ex) {
            return null;
        }
    }

    private byte[] hmacSha256Bytes(String signingInput) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretKey, "HmacSHA256"));
            return mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to sign JWT", ex);
        }
    }

    private String decodeSegment(String segment) {
        return new String(Base64.getUrlDecoder().decode(segment), StandardCharsets.UTF_8);
    }

    public record JwtClaims(String subject, String email) {
    }
}
