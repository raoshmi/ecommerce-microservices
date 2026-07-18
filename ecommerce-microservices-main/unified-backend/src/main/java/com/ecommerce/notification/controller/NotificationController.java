package com.ecommerce.notification.controller;

import com.ecommerce.notification.dto.NotificationRequestDTO;
import com.ecommerce.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * POST /api/notifications/send
     * Sends an email notification (mock log). Called internally by Order Service.
     */
    @PostMapping("/send")
    public ResponseEntity<Void> sendNotification(@Valid @RequestBody NotificationRequestDTO request) {
        notificationService.sendEmail(request);
        return ResponseEntity.ok().build();
    }
}
