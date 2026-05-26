package com.food.user.dto;

/**
 * response payload returning generated security credentials.
 */
public record AuthResponse(
    String token,
    UserDto user
) {}
