package com.food.order.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Stateful Shopping Cart model cached in Redis.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long customerId;
    private Long restaurantId;
    private String restaurantName;
    
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
}
