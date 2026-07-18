package com.ecommerce.user.repository;

import com.ecommerce.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find a user by email address (used for login and JWT validation). */
    Optional<User> findByEmail(String email);

    /** Check if an email is already registered (for duplicate prevention). */
    boolean existsByEmail(String email);
}
