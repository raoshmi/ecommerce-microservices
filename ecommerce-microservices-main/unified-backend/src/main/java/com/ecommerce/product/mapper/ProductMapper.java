package com.ecommerce.product.mapper;

import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product p) {
        if (p == null) {
            return null;
        }
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .category(p.getCategory())
                .imageUrl(p.getImageUrl())
                .createdAt(p.getCreatedAt())
                .build();
    }

    public Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }
        return Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock() != null ? dto.getStock() : 0)
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
