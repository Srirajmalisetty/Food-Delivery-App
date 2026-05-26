package com.food.user.dto;

import com.food.user.model.Role;

/**
 * Standard User Record DTO representing safe, non-sensitive account parameters.
 */
public record UserDto(
    Long id,
    String name,
    String email,
    String phone,
    Role role
) {}
