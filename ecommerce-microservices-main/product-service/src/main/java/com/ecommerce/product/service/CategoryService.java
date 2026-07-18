package com.ecommerce.product.service;

import com.ecommerce.product.entity.Category;
import com.ecommerce.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: id=" + id));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new RuntimeException("Category with name " + category.getName() + " already exists.");
        }
        Category saved = categoryRepository.save(category);
        log.info("Created category: id={}, name={}", saved.getId(), saved.getName());
        return saved;
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        
        categoryRepository.findByName(categoryDetails.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new RuntimeException("Category with name " + categoryDetails.getName() + " already exists.");
            }
        });

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());

        Category updated = categoryRepository.save(category);
        log.info("Updated category: id={}", updated.getId());
        return updated;
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found: id=" + id);
        }
        categoryRepository.deleteById(id);
        log.info("Deleted category: id={}", id);
    }
}
