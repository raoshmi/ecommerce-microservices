package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableCaching
@EnableFeignClients
@ComponentScan(basePackages = "com.ecommerce", excludeFilters = {
    @ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASPECTJ, pattern = "com.ecommerce.*.config.*"),
    @ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.ASPECTJ, pattern = "com.ecommerce.gateway.*")
})
@EntityScan(basePackages = "com.ecommerce")
@EnableJpaRepositories(basePackages = "com.ecommerce")
public class UnifiedApplication {
    public static void main(String[] args) {
        SpringApplication.run(UnifiedApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

