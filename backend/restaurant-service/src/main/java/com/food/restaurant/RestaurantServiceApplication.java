package com.food.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise Restaurant Service.
 * Coordinates restaurant profiles, catalogs, menus, classifications, and item pricings.
 */
@SpringBootApplication
public class RestaurantServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RestaurantServiceApplication.class, args);
    }
}
