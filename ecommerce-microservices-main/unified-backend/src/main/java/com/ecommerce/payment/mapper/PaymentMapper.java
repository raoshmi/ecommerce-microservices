package com.ecommerce.payment.mapper;

import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) {
            return null;
        }
        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .build();
    }

    public Payment toEntity(PaymentDTO dto) {
        if (dto == null) {
            return null;
        }
        return Payment.builder()
                .id(dto.getId())
                .orderId(dto.getOrderId())
                .amount(dto.getAmount())
                .status(dto.getStatus())
                .transactionId(dto.getTransactionId())
                .paymentDate(dto.getPaymentDate())
                .build();
    }
}
