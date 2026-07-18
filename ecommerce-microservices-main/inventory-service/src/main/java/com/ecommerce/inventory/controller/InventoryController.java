package com.ecommerce.inventory.controller;

import com.ecommerce.inventory.dto.InventoryDTO;
import com.ecommerce.inventory.dto.InventoryUpdateDTO;
import com.ecommerce.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * GET /api/inventory/{productId}
     * Retrieves the inventory level for a specific product.
     */
    @GetMapping("/{productId}")
    public ResponseEntity<InventoryDTO> getInventory(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }

    /**
     * PUT /api/inventory/update
     * Updates or creates the inventory count for a product. (Admin authorization is checked at API gateway).
     */
    @PutMapping("/update")
    public ResponseEntity<InventoryDTO> updateInventory(@Valid @RequestBody InventoryUpdateDTO dto) {
        return ResponseEntity.ok(inventoryService.updateInventory(dto));
    }

    /**
     * PUT /api/inventory/deduct
     * Deducts stock for a given product. Called internally by Order Service.
     */
    @PutMapping("/deduct")
    public ResponseEntity<Void> deductInventory(
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        inventoryService.deductInventory(productId, quantity);
        return ResponseEntity.ok().build();
    }
}
