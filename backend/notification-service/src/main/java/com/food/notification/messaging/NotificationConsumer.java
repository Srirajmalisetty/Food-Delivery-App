package com.food.notification.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Enterprise Event subscriber listening to Kafka updates and printing user alerts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final ObjectMapper objectMapper;

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "order-placed", groupId = "notification-group")
    public void consumeOrderPlaced(String message) {
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            Number id = (Number) payload.get("id");
            Number amount = (Number) payload.get("totalAmount");
            String address = (String) payload.get("deliveryAddress");

            log.info("\n" +
                    "================================================================================\n" +
                    "🔔 PUSH NOTIFICATION: [ORDER PLACED] \n" +
                    "================================================================================\n" +
                    "Dear Customer, your Order #{} has been placed successfully!\n" +
                    "Total Amount: ${}\n" +
                    "Deliver to: {}\n" +
                    "Status: Waiting for Payment Authorization...\n" +
                    "================================================================================",
                    id, amount, address);
        } catch (Exception e) {
            log.error("Failed to parse and print Order Placed notification", e);
        }
    }

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "payment-completed", groupId = "notification-group")
    public void consumePaymentCompleted(String message) {
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            Number orderId = (Number) payload.get("orderId");
            Number amount = (Number) payload.get("amount");
            String txn = (String) payload.get("transactionId");

            log.info("\n" +
                    "================================================================================\n" +
                    "🔔 PUSH NOTIFICATION: [PAYMENT COMPLETED] \n" +
                    "================================================================================\n" +
                    "Transaction Confirmed! Payment for Order #{} was successful.\n" +
                    "Charged amount: ${}\n" +
                    "Receipt ID: {}\n" +
                    "Status: Restaurant is confirming your meal!\n" +
                    "================================================================================",
                    orderId, amount, txn);
        } catch (Exception e) {
            log.error("Failed to parse and print Payment Completed notification", e);
        }
    }

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "payment-failed", groupId = "notification-group")
    public void consumePaymentFailed(String message) {
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            Number orderId = (Number) payload.get("orderId");
            Number amount = (Number) payload.get("amount");

            log.error("\n" +
                    "================================================================================\n" +
                    "⚠️ SMS NOTIFICATION: [PAYMENT DECLINED] \n" +
                    "================================================================================\n" +
                    "Alert! Payment transaction for Order #{} was declined.\n" +
                    "Charge amount: ${}\n" +
                    "Reason: Insufficient funds or invalid security token.\n" +
                    "Status: Order Cancelled automatically.\n" +
                    "================================================================================",
                    orderId, amount);
        } catch (Exception e) {
            log.error("Failed to parse and print Payment Failed notification", e);
        }
    }

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "order-status-updated", groupId = "notification-group")
    public void consumeOrderStatusUpdated(String message) {
        try {
            Map<String, Object> payload = objectMapper.readValue(message, Map.class);
            Number id = (Number) payload.get("id");
            String status = (String) payload.get("status");
            String restName = (String) payload.get("restaurantName");

            log.info("\n" +
                    "================================================================================\n" +
                    "🔔 PUSH NOTIFICATION: [DELIVERY UPDATE] \n" +
                    "================================================================================\n" +
                    "Your Order #{} from {} has transitioned!\n" +
                    "Current Milestone: [{}]\n" +
                    "================================================================================",
                    id, restName, status);
        } catch (Exception e) {
            log.error("Failed to parse and print Order Status update notification", e);
        }
    }
}
