package com.ecommerce;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class ProxyRecommendationController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${services.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @GetMapping("/{productId}")
    public ResponseEntity<Object> getRecommendations(@PathVariable Long productId) {
        String url = aiServiceUrl + "/api/recommendations/" + productId;
        try {
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(503).body("AI Service unavailable");
        }
    }
}
