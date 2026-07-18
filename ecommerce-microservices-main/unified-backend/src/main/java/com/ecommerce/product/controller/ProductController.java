package com.ecommerce.product.controller;

import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for Product CRUD operations.
 * Protected by API Gateway JWT filter.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** GET /api/products — list products with pagination and filters */
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.getProducts(search, category, minPrice, maxPrice, page, size));
    }

    /** GET /api/products/{id} — get a single product */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /** GET /api/products/recommendations — get recommended products */
    @GetMapping("/recommendations")
    public ResponseEntity<List<ProductDTO>> getRecommendations(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(productService.getRecommendations(userId));
    }

    /** POST /api/products — create a new product (ADMIN only) */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @Valid @RequestBody ProductDTO dto) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(dto));
    }

    /** PUT /api/products/{id} — update an existing product (ADMIN only) */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    /** DELETE /api/products/{id} — delete a product (ADMIN only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
