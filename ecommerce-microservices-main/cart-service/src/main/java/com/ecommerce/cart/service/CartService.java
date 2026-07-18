package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.*;
import com.ecommerce.cart.entity.Cart;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.repository.CartItemRepository;
import com.ecommerce.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Business logic for the Cart Service.
 * Calls Product Service via RestTemplate for product validation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final RestTemplate restTemplate;

    @Value("${services.product-service-url:http://localhost:8082}")
    private String productServiceUrl;

    /**
     * Returns the current user's cart, creating one if it doesn't exist.
     *
     * @param userId the authenticated user's ID (from X-User-Id header)
     */
    public CartDTO getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        return toDTO(cart);
    }

    /**
     * Adds a product to the cart. If already present, increments quantity.
     * Validates product existence against Product Service.
     */
    public CartDTO addToCart(Long userId, AddToCartRequest request) {
        // Fetch product details from Product Service
        Map<?, ?> product = restTemplate.getForObject(
                productServiceUrl + "/api/products/" + request.getProductId(),
                Map.class);

        if (product == null) {
            throw new RuntimeException("Product not found: id=" + request.getProductId());
        }

        String productName = (String) product.get("name");
        BigDecimal price   = new BigDecimal(product.get("price").toString());
        String imageUrl    = (String) product.get("imageUrl");

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));

        Optional<CartItem> existing = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), request.getProductId());

        if (existing.isPresent()) {
            // Product already in cart — increase quantity
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            // Add new item to cart
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .productId(request.getProductId())
                    .productName(productName)
                    .quantity(request.getQuantity())
                    .price(price)
                    .imageUrl(imageUrl)
                    .build();
            cart.getItems().add(item);
        }

        cart = cartRepository.save(cart);
        log.info("Added product {} to cart for user {}", request.getProductId(), userId);
        return toDTO(cart);
    }

    /**
     * Updates the quantity of a specific item. If quantity = 0, removes the item.
     */
    public CartDTO updateItem(Long userId, Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: id=" + itemId));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        return toDTO(cart);
    }

    /** Removes a single item from the cart. */
    public CartDTO removeItem(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: id=" + itemId));
        cartItemRepository.delete(item);

        Cart cart = cartRepository.findByUserId(userId).orElseThrow();
        return toDTO(cart);
    }

    /** Empties the entire cart (used after order is placed). */
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
            log.info("Cleared cart for user {}", userId);
        }
    }

    // ---- Helpers ----

    private Cart createNewCart(Long userId) {
        Cart cart = Cart.builder().userId(userId).build();
        return cartRepository.save(cart);
    }

    private CartDTO toDTO(Cart cart) {
        List<CartItemDTO> items = cart.getItems().stream()
                .map(i -> CartItemDTO.builder()
                        .id(i.getId())
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .subtotal(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                        .imageUrl(i.getImageUrl())
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .cartId(cart.getId())
                .userId(cart.getUserId())
                .items(items)
                .totalAmount(total)
                .build();
    }
}
