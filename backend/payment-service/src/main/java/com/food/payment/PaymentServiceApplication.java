package com.food.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise Payment Service Application.
 * Listens for order placements, simulates payment authorizations,
 * and publishes outcomes back to Apache Kafka to coordinate order state transitions.
 */
@SpringBootApplication
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
