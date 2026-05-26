package com.food.order.controller;

import com.food.order.dto.CreateOrderRequest;
import com.food.order.dto.OrderDto;
import com.food.order.model.OrderStatus;
import com.food.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller layer exposing endpoints for submitting order checkouts, query operations and lifecycle adjustments.
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@Valid @RequestBody CreateOrderRequest request) {
        log.info("REST request to checkout shopping basket and place Order");
        return ResponseEntity.ok(orderService.checkout(request));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getCustomerOrders(@PathVariable Long customerId) {
        log.info("REST request to retrieve history catalog for customer: {}", customerId);
        return ResponseEntity.ok(orderService.getCustomerOrders(customerId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        log.info("REST request to query order tracker: {}", orderId);
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        log.info("REST request to transition order tracking state to: {}", status);
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
