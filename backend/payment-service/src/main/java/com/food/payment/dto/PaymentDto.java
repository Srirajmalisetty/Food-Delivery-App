package com.food.payment.dto;

import com.food.payment.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Record DTO presenting transaction details securely to clients.
 */
public record PaymentDto(
    Long id,
    Long orderId,
    Long customerId,
    BigDecimal amount,
    PaymentStatus status,
    String transactionId,
    LocalDateTime processedAt
) {}
