package com.ecommerce.inventory.mapper;

import com.ecommerce.inventory.dto.InventoryDTO;
import com.ecommerce.inventory.entity.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryDTO toDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }
        return InventoryDTO.builder()
                .id(inventory.getId())
                .productId(inventory.getProductId())
                .quantity(inventory.getQuantity())
                .build();
    }

    public Inventory toEntity(InventoryDTO dto) {
        if (dto == null) {
            return null;
        }
        return Inventory.builder()
                .id(dto.getId())
                .productId(dto.getProductId())
                .quantity(dto.getQuantity())
                .build();
    }
}
