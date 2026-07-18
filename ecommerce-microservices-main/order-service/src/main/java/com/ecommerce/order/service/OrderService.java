package com.ecommerce.order.service;

import com.ecommerce.order.client.InventoryClient;
import com.ecommerce.order.client.NotificationClient;
import com.ecommerce.order.client.PaymentClient;
import com.ecommerce.order.client.ProductClient;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.mapper.OrderMapper;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Orchestrator service to place e-commerce orders.
 * Interacts with Product, Inventory, Payment, and Notification services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    private final NotificationClient notificationClient;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderDTO placeOrder(Long userId, OrderRequestDTO request, String userEmail) {
        log.info("Placing order for user: {}, items count: {}", userId, request.getItems().size());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // 1. Create order skeleton
        Order order = Order.builder()
                .userId(userId)
                .status(Order.OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        // 2. Validate products and inventory, deduct stock, and calculate prices
        for (OrderRequestDTO.OrderItemRequest itemReq : request.getItems()) {
            // Fetch product to verify existence and price
            ProductDTO product = productClient.getProduct(itemReq.getProductId());
            if (product == null) {
                throw new RuntimeException("Product not found: id=" + itemReq.getProductId());
            }

            // Verify inventory levels
            InventoryDTO inventory = inventoryClient.getInventory(itemReq.getProductId());
            if (inventory == null || inventory.getQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product " + product.getName() + 
                        ". Available: " + (inventory == null ? 0 : inventory.getQuantity()));
            }

            // Deduct stock via Feign client
            inventoryClient.deductInventory(itemReq.getProductId(), itemReq.getQuantity());

            // Compute item price and accumulate total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(itemReq.getProductId())
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        // 3. Save order to generate ID
        order = orderRepository.save(order);

        // 4. Process payment via Feign client
        try {
            PaymentRequestDTO paymentRequest = PaymentRequestDTO.builder()
                    .orderId(order.getId())
                    .amount(totalAmount)
                    .build();

            PaymentDTO payment = paymentClient.processPayment(paymentRequest);

            if ("SUCCESS".equalsIgnoreCase(payment.getStatus())) {
                order.setStatus(Order.OrderStatus.CONFIRMED);
            } else {
                order.setStatus(Order.OrderStatus.CANCELLED);
                log.warn("Payment failed for order: id={}, transactionStatus={}", order.getId(), payment.getStatus());
            }
        } catch (Exception e) {
            order.setStatus(Order.OrderStatus.CANCELLED);
            log.error("Payment processing failed for order {}: {}", order.getId(), e.getMessage());
        }

        // Save order with final status
        order = orderRepository.save(order);
        log.info("Order saved successfully: id={}, status={}", order.getId(), order.getStatus());

        // 5. Send order notification
        if (order.getStatus() == Order.OrderStatus.CONFIRMED && userEmail != null) {
            try {
                NotificationRequestDTO notification = NotificationRequestDTO.builder()
                        .email(userEmail)
                        .subject("Order Placed Successfully")
                        .message("Dear Customer,\n\nYour order #" + order.getId() + 
                                " for $" + totalAmount + " has been placed successfully.\n\nThank you for shopping with us!")
                        .build();
                notificationClient.sendNotification(notification);
            } catch (Exception e) {
                log.error("Failed to send order placement notification: {}", e.getMessage());
            }
        }

        return orderMapper.toDTO(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: id=" + id));
        return orderMapper.toDTO(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found: id=" + id);
        }
        orderRepository.deleteById(id);
        log.info("Deleted order: id={}", id);
    }
}
