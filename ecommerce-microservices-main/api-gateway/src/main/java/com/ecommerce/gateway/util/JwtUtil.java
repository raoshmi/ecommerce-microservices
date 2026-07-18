package com.ecommerce.gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

/**
 * Utility for validating JWT tokens in the API Gateway.
 * Signs/verifies tokens using HS256 with a shared secret.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    /** Returns the signing key derived from the configured secret. */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /** Validates the token signature and expiry. Returns true if valid. */
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /** Extracts all claims from a valid JWT token. */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Extracts the subject (email) from the token. */
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    /** Extracts the userId claim from the token. */
    public Long extractUserId(String token) {
        return ((Number) getClaims(token).get("userId")).longValue();
    }

    /** Extracts the role claim from the token. */
    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }
}
