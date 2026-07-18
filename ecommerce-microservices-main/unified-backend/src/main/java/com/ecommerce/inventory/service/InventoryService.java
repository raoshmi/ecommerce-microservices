package com.ecommerce.inventory.service;

import com.ecommerce.inventory.dto.InventoryDTO;
import com.ecommerce.inventory.dto.InventoryUpdateDTO;
import com.ecommerce.inventory.entity.Inventory;
import com.ecommerce.inventory.mapper.InventoryMapper;
import com.ecommerce.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;

    @Transactional(readOnly = true)
    public InventoryDTO getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    log.info("Inventory not found for product {}, initializing with 0 stock", productId);
                    return Inventory.builder().productId(productId).quantity(0).build();
                });
        return inventoryMapper.toDTO(inventory);
    }

    @Transactional
    public InventoryDTO updateInventory(InventoryUpdateDTO dto) {
        Inventory inventory = inventoryRepository.findByProductId(dto.getProductId())
                .orElseGet(() -> Inventory.builder().productId(dto.getProductId()).quantity(0).build());

        inventory.setQuantity(dto.getQuantity());
        inventory = inventoryRepository.save(inventory);
        log.info("Updated inventory for product {}: new quantity={}", dto.getProductId(), inventory.getQuantity());
        return inventoryMapper.toDTO(inventory);
    }

    @Transactional
    public void deductInventory(Long productId, Integer quantity) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product: id=" + productId));

        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product " + productId + ". Available: " + inventory.getQuantity());
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);
        log.info("Deducted {} items from product {} inventory. Remaining stock={}", quantity, productId, inventory.getQuantity());
    }
}
