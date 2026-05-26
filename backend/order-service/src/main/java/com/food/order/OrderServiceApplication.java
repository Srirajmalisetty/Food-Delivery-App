package com.food.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise Order Service Application.
 * Manages shopping carts via Redis, order creation, order state tracking,
 * and processes asynchronous state machines via Apache Kafka integration.
 */
@SpringBootApplication
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
