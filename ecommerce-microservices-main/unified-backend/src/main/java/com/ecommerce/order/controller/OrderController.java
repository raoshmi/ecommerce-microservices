package com.ecommerce.order.controller;

import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.dto.OrderRequestDTO;
import com.ecommerce.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/orders
     * Places a new order for the current user.
     */
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody OrderRequestDTO request) {
        OrderDTO order = orderService.placeOrder(userId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /**
     * GET /api/orders
     * Returns orders. ADMIN gets all orders, USER gets only their own.
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(orderService.getAllOrders());
        }
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    /**
     * GET /api/orders/{id}
     * Returns a specific order's details. Only ADMIN or the owner of the order can access.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {
        OrderDTO order = orderService.getOrderById(id);
        if (!"ADMIN".equalsIgnoreCase(role) && !order.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(order);
    }

    /**
     * DELETE /api/orders/{id}
     * Deletes an order by ID (ADMIN only).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
