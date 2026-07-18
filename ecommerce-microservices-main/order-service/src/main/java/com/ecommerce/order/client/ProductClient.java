package com.ecommerce.order.client;

import com.ecommerce.order.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PRODUCT-SERVICE", path = "/api/products")
public interface ProductClient {

    @GetMapping("/{id}")
    ProductDTO getProduct(@PathVariable("id") Long id);
}
