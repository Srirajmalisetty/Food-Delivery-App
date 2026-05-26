package com.food.payment.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.food.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Event consumer listening to order placements on Kafka and triggering payment simulations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderConsumer {

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "order-placed", groupId = "payment-group")
    public void consumeOrderPlaced(String message) {
        log.info("Received Kafka 'order-placed' event payload");
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            
            Number orderIdNum = (Number) payload.get("id");
            Number customerIdNum = (Number) payload.get("customerId");
            Number totalAmountNum = (Number) payload.get("totalAmount");

            Long orderId = orderIdNum.longValue();
            Long customerId = customerIdNum.longValue();
            BigDecimal amount = BigDecimal.valueOf(totalAmountNum.doubleValue());

            log.info("Triggering payment simulation for Order ID: {} for Customer ID: {}", orderId, customerId);
            paymentService.processPayment(orderId, customerId, amount);

        } catch (Exception e) {
            log.error("Failed to parse and process order placement event in payment consumer", e);
        }
    }
}
