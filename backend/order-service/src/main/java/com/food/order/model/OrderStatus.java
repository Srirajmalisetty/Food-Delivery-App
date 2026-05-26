package com.food.order.model;

/**
 * State machine designations for an order's lifecycle.
 */
public enum OrderStatus {
    PLACED,
    CONFIRMED,
    PREPARING,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    PAYMENT_FAILED
}
