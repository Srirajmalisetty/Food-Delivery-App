package com.food.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise Notification Service.
 * Listens for system-wide Kafka updates (order creation, checkout outcomes, tracking updates)
 * and emits simulated logs to active containers.
 */
@SpringBootApplication
public class NotificationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
