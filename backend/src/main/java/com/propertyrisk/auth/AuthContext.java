package com.propertyrisk.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthContext {

    public SupabaseJwtValidator.JwtClaims currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !(authentication.getPrincipal() instanceof SupabaseJwtValidator.JwtClaims claims)) {
            return null;
        }
        return claims;
    }
}
