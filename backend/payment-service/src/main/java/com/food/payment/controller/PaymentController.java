package com.food.payment.controller;

import com.food.payment.dto.PaymentDto;
import com.food.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller layer exposing endpoints for querying transaction status and details.
 */
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable Long orderId) {
        log.info("REST request to query payment status details for Order ID: {}", orderId);
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }
}
