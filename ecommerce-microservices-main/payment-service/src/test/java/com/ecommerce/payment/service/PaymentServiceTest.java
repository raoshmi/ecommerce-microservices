package com.ecommerce.payment.service;

import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.dto.PaymentRequestDTO;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.mapper.PaymentMapper;
import com.ecommerce.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private PaymentService paymentService;

    private Payment payment;
    private PaymentDTO paymentDTO;

    @BeforeEach
    public void setup() {
        payment = Payment.builder()
                .id(1L)
                .orderId(12L)
                .amount(BigDecimal.valueOf(150.00))
                .status("SUCCESS")
                .transactionId("mock-txn-uuid")
                .build();

        paymentDTO = PaymentDTO.builder()
                .id(1L)
                .orderId(12L)
                .amount(BigDecimal.valueOf(150.00))
                .status("SUCCESS")
                .transactionId("mock-txn-uuid")
                .build();
    }

    @Test
    public void testProcessPayment_Success() {
        PaymentRequestDTO request = PaymentRequestDTO.builder()
                .orderId(12L)
                .amount(BigDecimal.valueOf(150.00))
                .build();

        when(paymentRepository.findByOrderId(12L)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(paymentMapper.toDTO(any(Payment.class))).thenReturn(paymentDTO);

        PaymentDTO result = paymentService.processPayment(request);

        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
        assertEquals(BigDecimal.valueOf(150.00), result.getAmount());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    public void testGetPaymentByOrderId_Success() {
        when(paymentRepository.findByOrderId(12L)).thenReturn(Optional.of(payment));
        when(paymentMapper.toDTO(payment)).thenReturn(paymentDTO);

        PaymentDTO result = paymentService.getPaymentByOrderId(12L);

        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
        verify(paymentRepository, times(1)).findByOrderId(12L);
    }
}
