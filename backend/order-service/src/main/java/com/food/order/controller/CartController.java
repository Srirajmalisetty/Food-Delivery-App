package com.food.order.controller;

import com.food.order.dto.CartDto;
import com.food.order.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller layer exposing endpoints for manipulating stateful Redis shopping carts.
 */
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CartDto> getCart(@PathVariable Long customerId) {
        log.info("REST request to view shopping cart for customer: {}", customerId);
        return ResponseEntity.ok(cartService.getCart(customerId));
    }

    @PostMapping("/{customerId}/items")
    public ResponseEntity<CartDto> addToCart(
            @PathVariable Long customerId,
            @RequestParam Long restaurantId,
            @RequestParam String restaurantName,
            @RequestBody CartDto.CartItemDto itemDto
    ) {
        log.info("REST request to add item to basket for customer: {}", customerId);
        return ResponseEntity.ok(cartService.addToCart(customerId, restaurantId, restaurantName, itemDto));
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<CartDto> clearCart(@PathVariable Long customerId) {
        log.info("REST request to clear shopping basket content");
        return ResponseEntity.ok(cartService.clearCart(customerId));
    }
}
