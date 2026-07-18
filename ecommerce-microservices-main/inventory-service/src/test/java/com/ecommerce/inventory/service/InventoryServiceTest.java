package com.ecommerce.inventory.service;

import com.ecommerce.inventory.dto.InventoryDTO;
import com.ecommerce.inventory.dto.InventoryUpdateDTO;
import com.ecommerce.inventory.entity.Inventory;
import com.ecommerce.inventory.mapper.InventoryMapper;
import com.ecommerce.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private InventoryMapper inventoryMapper;

    @InjectMocks
    private InventoryService inventoryService;

    private Inventory inventory;
    private InventoryDTO inventoryDTO;

    @BeforeEach
    public void setup() {
        inventory = Inventory.builder()
                .id(1L)
                .productId(101L)
                .quantity(50)
                .build();

        inventoryDTO = InventoryDTO.builder()
                .id(1L)
                .productId(101L)
                .quantity(50)
                .build();
    }

    @Test
    public void testGetInventoryByProductId_Success() {
        when(inventoryRepository.findByProductId(101L)).thenReturn(Optional.of(inventory));
        when(inventoryMapper.toDTO(inventory)).thenReturn(inventoryDTO);

        InventoryDTO result = inventoryService.getInventoryByProductId(101L);

        assertNotNull(result);
        assertEquals(50, result.getQuantity());
        verify(inventoryRepository, times(1)).findByProductId(101L);
    }

    @Test
    public void testUpdateInventory_Success() {
        InventoryUpdateDTO updateDTO = InventoryUpdateDTO.builder()
                .productId(101L)
                .quantity(100)
                .build();

        inventory.setQuantity(100);
        inventoryDTO.setQuantity(100);

        when(inventoryRepository.findByProductId(101L)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);
        when(inventoryMapper.toDTO(any(Inventory.class))).thenReturn(inventoryDTO);

        InventoryDTO result = inventoryService.updateInventory(updateDTO);

        assertNotNull(result);
        assertEquals(100, result.getQuantity());
        verify(inventoryRepository, times(1)).save(any(Inventory.class));
    }

    @Test
    public void testDeductInventory_Success() {
        when(inventoryRepository.findByProductId(101L)).thenReturn(Optional.of(inventory));

        assertDoesNotThrow(() -> inventoryService.deductInventory(101L, 10));

        assertEquals(40, inventory.getQuantity());
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    public void testDeductInventory_InsufficientStock() {
        when(inventoryRepository.findByProductId(101L)).thenReturn(Optional.of(inventory));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.deductInventory(101L, 60);
        });

        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(inventoryRepository, never()).save(any(Inventory.class));
    }
}
