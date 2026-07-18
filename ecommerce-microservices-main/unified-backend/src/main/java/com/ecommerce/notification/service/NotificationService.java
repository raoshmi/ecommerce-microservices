package com.ecommerce.notification.service;

import com.ecommerce.notification.dto.NotificationRequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendEmail(NotificationRequestDTO request) {
        log.info("------------------------------------------------------------");
        log.info("✉️  SENDING EMAIL NOTIFICATION");
        log.info("To:      {}", request.getEmail());
        log.info("Subject: {}", request.getSubject());
        log.info("Message: \n{}", request.getMessage());
        log.info("------------------------------------------------------------");
        log.info("Email notification sent successfully!");
    }
}
