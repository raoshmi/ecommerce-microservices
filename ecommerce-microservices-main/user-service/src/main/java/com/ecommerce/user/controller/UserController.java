package com.ecommerce.user.controller;

import com.ecommerce.user.dto.UserDTO;
import com.ecommerce.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * User profile endpoints. Ingests requests and extracts gateway security headers.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users/profile
     * Retrieves the profile of the currently logged-in user.
     */
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    /**
     * PUT /api/users/profile
     * Updates the profile of the currently logged-in user.
     */
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateUserProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUserProfile(userId, userDTO));
    }

    /**
     * GET /api/users/{id}
     * Retrieves any user's profile by ID. Used internally or by admin.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
