package com.food.order.service;

import com.food.order.model.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Simulator that drives the live order tracking milestones asynchronously
 * once payment has been confirmed.
 */
@Component
@Slf4j
public class OrderSimulator {

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(2);
    private OrderService orderService;

    @Autowired
    public void setOrderService(@Lazy OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Schedules state transitions from CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
     * with standard intervals to make the tracking board feel interactive and alive.
     */
    public void simulateOrderStatusTransitions(Long orderId) {
        log.info("Scheduling simulated milestone flow for Order ID: {}", orderId);

        // Step 1: Transition to PREPARING after 6 seconds
        executorService.schedule(() -> {
            try {
                log.info("Simulator [PREPARING]: Transitioning Order ID: {}", orderId);
                orderService.updateOrderStatus(orderId, OrderStatus.PREPARING);
            } catch (Exception e) {
                log.error("Simulation error transitioning to PREPARING for Order ID: {}", orderId, e);
            }
        }, 6, TimeUnit.SECONDS);

        // Step 2: Transition to OUT_FOR_DELIVERY after 12 seconds
        executorService.schedule(() -> {
            try {
                log.info("Simulator [OUT_FOR_DELIVERY]: Transitioning Order ID: {}", orderId);
                orderService.updateOrderStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);
            } catch (Exception e) {
                log.error("Simulation error transitioning to OUT_FOR_DELIVERY for Order ID: {}", orderId, e);
            }
        }, 12, TimeUnit.SECONDS);

        // Step 3: Transition to DELIVERED after 18 seconds
        executorService.schedule(() -> {
            try {
                log.info("Simulator [DELIVERED]: Transitioning Order ID: {}", orderId);
                orderService.updateOrderStatus(orderId, OrderStatus.DELIVERED);
            } catch (Exception e) {
                log.error("Simulation error transitioning to DELIVERED for Order ID: {}", orderId, e);
            }
        }, 18, TimeUnit.SECONDS);
    }
}
