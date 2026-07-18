package com.ecommerce.order.client;

import com.ecommerce.order.dto.InventoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "INVENTORY-SERVICE", url = "http://localhost:8080", path = "/api/inventory")
public interface InventoryClient {

    @GetMapping("/{productId}")
    InventoryDTO getInventory(@PathVariable("productId") Long productId);

    @PutMapping("/deduct")
    void deductInventory(@RequestParam("productId") Long productId, @RequestParam("quantity") Integer quantity);
}
