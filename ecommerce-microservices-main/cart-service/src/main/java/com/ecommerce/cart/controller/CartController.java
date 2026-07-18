package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartDTO;
import com.ecommerce.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for cart operations.
 * User identity comes from X-User-Id header injected by the API Gateway.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /** GET /api/cart — get the current user's cart */
    @GetMapping
    public ResponseEntity<CartDTO> getCart(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    /** POST /api/cart/items — add a product to the cart */
    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    /** PUT /api/cart/items/{itemId}?quantity={n} — update item quantity */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateItem(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long itemId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateItem(userId, itemId, quantity));
    }

    /** DELETE /api/cart/items/{itemId} — remove a specific item */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItem(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(userId, itemId));
    }

    /** DELETE /api/cart — clear entire cart */
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
