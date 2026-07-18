package com.ecommerce.payment.service;

import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.dto.PaymentRequestDTO;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.mapper.PaymentMapper;
import com.ecommerce.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    @Transactional
    public PaymentDTO processPayment(PaymentRequestDTO request) {
        log.info("Processing payment for order: {}, amount: {}", request.getOrderId(), request.getAmount());

        // Check if payment already exists
        Payment existingPayment = paymentRepository.findByOrderId(request.getOrderId()).orElse(null);
        if (existingPayment != null) {
            log.info("Payment already exists for order {}, returning details", request.getOrderId());
            return paymentMapper.toDTO(existingPayment);
        }

        // Mock payment validation - successful if amount is positive
        String status = "SUCCESS";
        if (request.getAmount() == null || request.getAmount().doubleValue() <= 0) {
            status = "FAILED";
        }

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .status(status)
                .transactionId(UUID.randomUUID().toString())
                .build();

        payment = paymentRepository.save(payment);
        log.info("Payment processed: id={}, status={}, transactionId={}", 
                payment.getId(), payment.getStatus(), payment.getTransactionId());

        return paymentMapper.toDTO(payment);
    }

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment record not found for order id: " + orderId));
        return paymentMapper.toDTO(payment);
    }
}
