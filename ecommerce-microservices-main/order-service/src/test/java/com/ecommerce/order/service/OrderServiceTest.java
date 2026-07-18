package com.ecommerce.order.service;

import com.ecommerce.order.client.*;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.mapper.OrderMapper;
import com.ecommerce.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductClient productClient;

    @Mock
    private InventoryClient inventoryClient;

    @Mock
    private PaymentClient paymentClient;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderService orderService;

    private OrderRequestDTO orderRequestDTO;
    private ProductDTO productDTO;
    private InventoryDTO inventoryDTO;
    private PaymentDTO paymentDTO;
    private Order order;
    private OrderDTO orderDTO;

    @BeforeEach
    public void setup() {
        OrderRequestDTO.OrderItemRequest itemRequest = OrderRequestDTO.OrderItemRequest.builder()
                .productId(101L)
                .quantity(2)
                .build();

        orderRequestDTO = OrderRequestDTO.builder()
                .items(Collections.singletonList(itemRequest))
                .build();

        productDTO = ProductDTO.builder()
                .id(101L)
                .name("Keyboard")
                .price(BigDecimal.valueOf(49.99))
                .stock(10)
                .build();

        inventoryDTO = InventoryDTO.builder()
                .id(1L)
                .productId(101L)
                .quantity(5)
                .build();

        paymentDTO = PaymentDTO.builder()
                .id(1L)
                .orderId(1L)
                .amount(BigDecimal.valueOf(99.98))
                .status("SUCCESS")
                .transactionId("TXN12345")
                .build();

        order = Order.builder()
                .id(1L)
                .userId(1L)
                .status(Order.OrderStatus.PENDING)
                .totalAmount(BigDecimal.valueOf(99.98))
                .build();

        orderDTO = OrderDTO.builder()
                .id(1L)
                .userId(1L)
                .status("COMPLETED")
                .totalAmount(BigDecimal.valueOf(99.98))
                .build();
    }

    @Test
    public void testPlaceOrder_Success() {
        when(productClient.getProduct(101L)).thenReturn(productDTO);
        when(inventoryClient.getInventory(101L)).thenReturn(inventoryDTO);
        doNothing().when(inventoryClient).deductInventory(101L, 2);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(paymentClient.processPayment(any(PaymentRequestDTO.class))).thenReturn(paymentDTO);
        when(orderMapper.toDTO(any(Order.class))).thenReturn(orderDTO);

        OrderDTO result = orderService.placeOrder(1L, orderRequestDTO, "user@example.com");

        assertNotNull(result);
        assertEquals("COMPLETED", result.getStatus());
        assertEquals(BigDecimal.valueOf(99.98), result.getTotalAmount());
        verify(inventoryClient, times(1)).deductInventory(101L, 2);
        verify(paymentClient, times(1)).processPayment(any(PaymentRequestDTO.class));
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequestDTO.class));
    }
}
