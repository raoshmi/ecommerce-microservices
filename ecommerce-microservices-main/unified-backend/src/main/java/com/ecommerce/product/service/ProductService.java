package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.mapper.ProductMapper;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for product CRUD operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;
    private final ProductMapper productMapper;

    @Value("${services.ai-service-url:https://ecommerce-ai-service.onrender.com}")
    private String aiServiceUrl;

    /** Returns products with pagination, search, and filter. */
    public Page<ProductDTO> getProducts(String name, String category, Double minPrice, Double maxPrice, int page, int size) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null && !name.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (category != null && !category.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), BigDecimal.valueOf(minPrice)));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), BigDecimal.valueOf(maxPrice)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, PageRequest.of(page, size)).map(productMapper::toDTO);
    }

    /** Returns all products in the catalog (Legacy). */
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /** Returns a single product by ID. Throws if not found. */
    @Cacheable(value = "products", key = "#id")
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: id=" + id));
        return productMapper.toDTO(product);
    }

    /** Returns recommended products from AI recommender or fallbacks. */
    public List<ProductDTO> getRecommendations(Long userId) {
        log.info("Fetching AI recommendations for user: {}", userId);
        try {
            String url = aiServiceUrl + "/recommend/" + userId;
            ProductDTO[] recommendations = restTemplate.getForObject(url, ProductDTO[].class);
            
            if (recommendations != null && recommendations.length > 0) {
                return Arrays.asList(recommendations);
            }
        } catch (Exception e) {
            log.warn("AI service unavailable, falling back to recent products: {}", e.getMessage());
        }

        return productRepository.findAll(PageRequest.of(0, 5))
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /** Creates a new product and returns it. */
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = productMapper.toEntity(dto);
        product = productRepository.save(product);
        log.info("Created product: id={}, name={}", product.getId(), product.getName());
        return productMapper.toDTO(product);
    }

    /** Updates an existing product by ID. */
    @CacheEvict(value = "products", key = "#id")
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: id=" + id));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());
        existing.setCategory(dto.getCategory());
        existing.setImageUrl(dto.getImageUrl());

        existing = productRepository.save(existing);
        log.info("Updated product: id={}", existing.getId());
        return productMapper.toDTO(existing);
    }

    /** Deletes a product by ID. */
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found: id=" + id);
        }
        productRepository.deleteById(id);
        log.info("Deleted product: id={}", id);
    }
}
