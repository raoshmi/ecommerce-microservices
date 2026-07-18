package com.ecommerce.cart.dto;

import lombok.*;
import java.math.BigDecimal;

/** DTO for a single cart item. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private String imageUrl;
}
