package com.ecommerce.notification.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDTO {

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Email subject is required")
    private String subject;

    @NotBlank(message = "Email message body is required")
    private String message;
}
