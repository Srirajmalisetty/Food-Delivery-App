package com.food.order.service;

import com.food.order.dto.CartDto;
import com.food.order.dto.CreateOrderRequest;
import com.food.order.dto.OrderDto;
import com.food.order.messaging.OrderProducer;
import com.food.order.model.Order;
import com.food.order.model.OrderItem;
import com.food.order.model.OrderStatus;
import com.food.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise service handling order checkout lifecycle, state machines, and message distribution.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final OrderProducer orderProducer;
    private final OrderSimulator orderSimulator;

    @Transactional
    public OrderDto checkout(CreateOrderRequest request) {
        log.info("Processing order checkout pipeline for customer: {}", request.customerId());

        CartDto cart = cartService.getCart(request.customerId());
        if (cart.items() == null || cart.items().isEmpty()) {
            throw new IllegalArgumentException("Cannot checkout: Shopping cart is empty");
        }

        java.math.BigDecimal finalTotal = cart.totalAmount();
        if (request.discount() != null) {
            finalTotal = finalTotal.subtract(request.discount());
            if (finalTotal.compareTo(java.math.BigDecimal.ZERO) < 0) {
                finalTotal = java.math.BigDecimal.ZERO;
            }
        }

        Order order = Order.builder()
                .customerId(request.customerId())
                .restaurantId(cart.restaurantId())
                .restaurantName(cart.restaurantName())
                .totalAmount(finalTotal)
                .status(OrderStatus.PLACED)
                .deliveryAddress(request.deliveryAddress())
                .build();

        List<OrderItem> orderItems = cart.items().stream()
                .map(item -> OrderItem.builder()
                        .menuItemId(item.menuItemId())
                        .name(item.name())
                        .price(item.price())
                        .quantity(item.quantity())
                        .order(order)
                        .build())
                .collect(Collectors.toList());

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(request.customerId());

        OrderDto orderDto = mapToDto(savedOrder);
        
        // Asynchronously publish order placement event to Kafka
        orderProducer.sendOrderPlacedEvent(orderDto);

        return orderDto;
    }

    public List<OrderDto> getCustomerOrders(Long customerId) {
        log.info("Fetching all order history for customer: {}", customerId);
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long orderId) {
        log.info("Fetching order info by ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        return mapToDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        log.info("Mutating status state for Order ID: {} to: {}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        OrderDto orderDto = mapToDto(updatedOrder);
        orderProducer.sendOrderStatusUpdateEvent(orderDto);

        // If payment is successfully confirmed, trigger the asynchronous tracking timeline simulator
        if (status == OrderStatus.CONFIRMED) {
            orderSimulator.simulateOrderStatusTransitions(orderId);
        }

        return orderDto;
    }

    private OrderDto mapToDto(Order order) {
        List<OrderDto.OrderItemDto> itemsList = order.getItems().stream()
                .map(item -> new OrderDto.OrderItemDto(
                        item.getId(),
                        item.getMenuItemId(),
                        item.getName(),
                        item.getPrice(),
                        item.getQuantity()
                ))
                .collect(Collectors.toList());

        return new OrderDto(
                order.getId(),
                order.getCustomerId(),
                order.getRestaurantId(),
                order.getRestaurantName(),
                itemsList,
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getCreatedAt()
        );
    }
}
