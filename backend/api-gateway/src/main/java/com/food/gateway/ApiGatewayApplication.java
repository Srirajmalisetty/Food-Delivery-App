package com.food.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise API Gateway Service using Spring Cloud Gateway.
 * Orchestrates unified routing and handles CORS for external React client requests.
 */
@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
