package com.food.order.dto;

import com.food.order.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Record DTO mapping database orders to standard response objects.
 */
public record OrderDto(
    Long id,
    Long customerId,
    Long restaurantId,
    String restaurantName,
    List<OrderItemDto> items,
    BigDecimal totalAmount,
    OrderStatus status,
    String deliveryAddress,
    LocalDateTime createdAt
) {
    public record OrderItemDto(
        Long id,
        Long menuItemId,
        String name,
        BigDecimal price,
        Integer quantity
    ) {}
}
