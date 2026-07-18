package com.ecommerce.order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/** DTO for parsing the Cart Service response. */
@Data
public class CartDTO {
    private Long cartId;
    private Long userId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;
}
