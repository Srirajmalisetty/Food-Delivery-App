package com.food.order.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Serializable shopping cart item stored in Redis.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long menuItemId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
}
