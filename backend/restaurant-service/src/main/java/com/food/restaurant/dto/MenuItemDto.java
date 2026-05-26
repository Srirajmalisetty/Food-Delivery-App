package com.food.restaurant.dto;

import java.math.BigDecimal;

/**
 * Record DTO presenting specific items on food menus.
 */
public record MenuItemDto(
    Long id,
    String name,
    String description,
    BigDecimal price,
    String category,
    Boolean available
) {}
