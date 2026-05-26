package com.food.order.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Record DTO mapping shopping cart and calculated aggregate amounts.
 */
public record CartDto(
    Long customerId,
    Long restaurantId,
    String restaurantName,
    List<CartItemDto> items,
    BigDecimal totalAmount
) {
    public record CartItemDto(
        Long menuItemId,
        String name,
        BigDecimal price,
        Integer quantity,
        BigDecimal subTotal
    ) {}
}
