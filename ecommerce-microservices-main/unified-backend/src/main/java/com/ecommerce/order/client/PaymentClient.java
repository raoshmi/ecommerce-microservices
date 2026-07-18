package com.ecommerce.order.client;

import com.ecommerce.order.dto.PaymentDTO;
import com.ecommerce.order.dto.PaymentRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "PAYMENT-SERVICE", url = "http://localhost:8080", path = "/api/payments")
public interface PaymentClient {

    @PostMapping
    PaymentDTO processPayment(@RequestBody PaymentRequestDTO request);
}
