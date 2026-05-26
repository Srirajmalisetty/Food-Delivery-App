package com.food.order.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.food.order.model.OrderStatus;
import com.food.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Event consumer listening to payment-related Kafka updates and driving order state transitions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentConsumer {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "payment-completed", groupId = "order-group")
    public void consumePaymentCompleted(String message) {
        log.info("Received Kafka payment success payload notification");
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            
            // Extract attributes and safely map to long
            Number orderIdNum = (Number) payload.get("orderId");
            Long orderId = orderIdNum.longValue();

            log.info("Transitioning Order ID: {} to CONFIRMED following verified payment", orderId);
            
            // Retry block to handle transactional race conditions (ensuring checkout transaction has committed)
            int retries = 0;
            while (true) {
                try {
                    orderService.updateOrderStatus(orderId, OrderStatus.CONFIRMED);
                    break;
                } catch (IllegalArgumentException e) {
                    if (e.getMessage() != null && e.getMessage().contains("Order not found")) {
                        retries++;
                        if (retries >= 5) {
                            throw e;
                        }
                        log.info("Order ID: {} database record not yet committed. Retrying in 200ms (attempt {}/5)...", orderId, retries);
                        Thread.sleep(200);
                    } else {
                        throw e;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse and process payment success event from Kafka queue", e);
        }
    }

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "payment-failed", groupId = "order-group")
    public void consumePaymentFailed(String message) {
        log.warn("Received Kafka payment failed notification");
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            
            // Extract attributes and safely map to long
            Number orderIdNum = (Number) payload.get("orderId");
            Long orderId = orderIdNum.longValue();

            log.warn("Transitioning Order ID: {} to PAYMENT_FAILED following declined checkout request", orderId);
            
            // Retry block to handle transactional race conditions
            int retries = 0;
            while (true) {
                try {
                    orderService.updateOrderStatus(orderId, OrderStatus.PAYMENT_FAILED);
                    break;
                } catch (IllegalArgumentException e) {
                    if (e.getMessage() != null && e.getMessage().contains("Order not found")) {
                        retries++;
                        if (retries >= 5) {
                            throw e;
                        }
                        log.info("Order ID: {} database record not yet committed. Retrying in 200ms (attempt {}/5)...", orderId, retries);
                        Thread.sleep(200);
                    } else {
                        throw e;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse and process payment failure event from Kafka queue", e);
        }
    }
}
