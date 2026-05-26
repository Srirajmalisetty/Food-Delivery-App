package com.food.payment.service;

import com.food.payment.dto.PaymentDto;
import com.food.payment.messaging.PaymentProducer;
import com.food.payment.model.Payment;
import com.food.payment.model.PaymentStatus;
import com.food.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Enterprise service layer managing payment simulations and records preservation.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentProducer paymentProducer;

    @Transactional
    public PaymentDto processPayment(Long orderId, Long customerId, BigDecimal amount) {
        log.info("Starting payment authorization simulation for Order ID: {}, Amount: {}", orderId, amount);

        // Simulation logic: fail payments exceeding 2000.00 for simulation variety
        PaymentStatus status = amount.compareTo(BigDecimal.valueOf(2000.00)) > 0 
                ? PaymentStatus.FAILED 
                : PaymentStatus.SUCCESS;

        String txnId = UUID.randomUUID().toString();

        Payment payment = Payment.builder()
                .orderId(orderId)
                .customerId(customerId)
                .amount(amount)
                .status(status)
                .transactionId(status == PaymentStatus.SUCCESS ? txnId : "DECLINED")
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        PaymentDto dto = mapToDto(savedPayment);

        // Publish event to Kafka
        paymentProducer.sendPaymentEvent(dto);

        return dto;
    }

    public PaymentDto getPaymentByOrderId(Long orderId) {
        log.info("Querying transaction histories for Order ID: {}", orderId);
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found for Order ID: " + orderId));
        return mapToDto(payment);
    }

    private PaymentDto mapToDto(Payment payment) {
        return new PaymentDto(
                payment.getId(),
                payment.getOrderId(),
                payment.getCustomerId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getTransactionId(),
                payment.getProcessedAt()
        );
    }
}
