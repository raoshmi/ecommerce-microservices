package com.ecommerce;

import com.ecommerce.user.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class UnifiedSecurityConfig implements WebMvcConfigurer {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/recommendations/**").permitAll()
                .requestMatchers("/health", "/actuator/health").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig::disable)) // For H2 console
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    @Component
    @RequiredArgsConstructor
    public static class JwtFilter extends OncePerRequestFilter {
        private final JwtUtil jwtUtil;

        private static final List<String> OPEN_PATHS = Arrays.asList(
                "/api/auth/register",
                "/api/auth/login",
                "/api/products",
                "/api/recommendations",
                "/health",
                "/actuator"
        );

        @Override
        protected void doFilterInternal(
                @org.springframework.lang.NonNull HttpServletRequest request, 
                @org.springframework.lang.NonNull HttpServletResponse response, 
                @org.springframework.lang.NonNull FilterChain filterChain)
                throws ServletException, IOException {
            
            String path = request.getRequestURI();
            
            if (isOpenPath(path)) {
                filterChain.doFilter(request, response);
                return;
            }

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.isTokenValid(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Extract claims and set as headers for controller compatibility
            Claims claims = jwtUtil.getClaims(token);
            
            // Set Authentication in SecurityContext so Spring Security allows the request
            org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    claims.getSubject(), null, java.util.Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + claims.get("role").toString())
                    ));
            org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authToken);

            HeaderMapRequestWrapper wrappedRequest = new HeaderMapRequestWrapper(request);
            wrappedRequest.addHeader("X-User-Id", claims.get("userId").toString());
            wrappedRequest.addHeader("X-User-Email", claims.getSubject());
            wrappedRequest.addHeader("X-User-Role", claims.get("role").toString());

            filterChain.doFilter(wrappedRequest, response);
        }

        private boolean isOpenPath(String path) {
            return OPEN_PATHS.stream().anyMatch(path::startsWith);
        }
    }

    /** Helper class to add headers to the request */
    private static class HeaderMapRequestWrapper extends jakarta.servlet.http.HttpServletRequestWrapper {
        private final java.util.Map<String, String> headerMap = new java.util.HashMap<>();

        public HeaderMapRequestWrapper(HttpServletRequest request) {
            super(request);
        }

        public void addHeader(String name, String value) {
            headerMap.put(name, value);
        }

        @Override
        public String getHeader(String name) {
            String headerValue = super.getHeader(name);
            if (headerMap.containsKey(name)) {
                headerValue = headerMap.get(name);
            }
            return headerValue;
        }

        @Override
        public java.util.Enumeration<String> getHeaderNames() {
            java.util.List<String> names = java.util.Collections.list(super.getHeaderNames());
            names.addAll(headerMap.keySet());
            return java.util.Collections.enumeration(names);
        }

        @Override
        public java.util.Enumeration<String> getHeaders(String name) {
            if (headerMap.containsKey(name)) {
                return java.util.Collections.enumeration(java.util.Collections.singletonList(headerMap.get(name)));
            }
            return super.getHeaders(name);
        }
    }
}
