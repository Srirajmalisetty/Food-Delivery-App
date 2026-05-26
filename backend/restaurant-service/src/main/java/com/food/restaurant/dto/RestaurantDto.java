package com.food.restaurant.dto;

import java.util.List;

/**
 * Record DTO presenting restaurant details securely.
 */
public record RestaurantDto(
    Long id,
    String name,
    String cuisine,
    String address,
    String phone,
    Double rating,
    List<MenuItemDto> menu
) {}
