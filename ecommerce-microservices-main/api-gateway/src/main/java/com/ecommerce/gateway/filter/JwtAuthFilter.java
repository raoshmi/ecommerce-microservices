package com.ecommerce.gateway.filter;

import com.ecommerce.gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Global JWT authentication filter for the API Gateway.
 * Validates Bearer tokens and forwards userId/email to downstream services via headers.
 */
@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(JwtAuthFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    public JwtAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();
            String method = request.getMethod().name();

            // Allow public routes through without JWT
            if (isOpenPath(path, method)) {
                return chain.filter(exchange);
            }

            // Check Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return rejectRequest(exchange, "Missing Authorization header");
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return rejectRequest(exchange, "Invalid Authorization format");
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.isTokenValid(token)) {
                return rejectRequest(exchange, "Invalid or expired JWT token");
            }

            // Extract user info and forward as internal headers to downstream services
            Claims claims = jwtUtil.getClaims(token);
            Long userId = ((Number) claims.get("userId")).longValue();
            String email  = claims.getSubject();
            String role   = (String) claims.get("role");

            log.debug("JWT valid — userId={}, email={}, role={}", userId, email, role);

            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id",    userId.toString())
                    .header("X-User-Email", email)
                    .header("X-User-Role",  role)
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }

    private boolean isOpenPath(String path, String method) {
        if (path.startsWith("/api/auth/register") || 
            path.startsWith("/api/auth/login") || 
            path.startsWith("/api/auth/refresh")) {
            return true;
        }
        if (path.startsWith("/api/products") && "GET".equalsIgnoreCase(method)) {
            return true;
        }
        // Swagger and OpenAPI endpoints are open too
        if (path.contains("/v3/api-docs") || path.contains("/swagger-ui")) {
            return true;
        }
        return false;
    }

    private Mono<Void> rejectRequest(ServerWebExchange exchange, String message) {
        log.warn("JWT validation failed: {}", message);
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    /** Config class required by AbstractGatewayFilterFactory */
    public static class Config {
        private boolean secured = true;

        public boolean isSecured() { return secured; }
        public void setSecured(boolean secured) { this.secured = secured; }
    }
}
