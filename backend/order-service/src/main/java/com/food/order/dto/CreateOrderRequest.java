package com.food.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * request payload submitted to checkout user carts.
 */
public record CreateOrderRequest(
    @NotNull(message = "Customer ID is required")
    Long customerId,

    @NotBlank(message = "Delivery address is required")
    String deliveryAddress,

    java.math.BigDecimal discount
) {}
