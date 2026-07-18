package com.ecommerce.cart.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

/** DTO representing the full cart with all items and total. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long cartId;
    private Long userId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
}
