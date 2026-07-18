package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    /** Find all products in a given category. */
    List<Product> findByCategory(String category);

    /** Search products by name (case-insensitive, partial match). */
    List<Product> findByNameContainingIgnoreCase(String keyword);

    /** Find products with stock greater than 0 (available items). */
    List<Product> findByStockGreaterThan(int stock);
}
