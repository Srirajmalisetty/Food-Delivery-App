package com.food.notification.config;

import org.springframework.context.annotation.Configuration;

/**
 * Kafka central configurations mapping common message destinations.
 */
@Configuration
public class KafkaConfig {
    public static final String ORDER_PLACED_TOPIC = "order-placed";
    public static final String ORDER_STATUS_TOPIC = "order-status-updated";
    public static final String PAYMENT_COMPLETED_TOPIC = "payment-completed";
    public static final String PAYMENT_FAILED_TOPIC = "payment-failed";
}
