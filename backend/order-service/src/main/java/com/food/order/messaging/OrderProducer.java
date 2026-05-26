package com.food.order.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.food.order.config.KafkaConfig;
import com.food.order.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Event producer formatting order structures into JSON messages and broadcasting to Kafka nodes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendOrderPlacedEvent(OrderDto orderDto) {
        try {
            String message = objectMapper.writeValueAsString(orderDto);
            log.info("Publishing 'order-placed' event to Kafka topic for Order ID: {}", orderDto.id());
            kafkaTemplate.send(KafkaConfig.ORDER_PLACED_TOPIC, orderDto.id().toString(), message);
        } catch (Exception e) {
            log.error("Failed to publish order event to Kafka topic", e);
        }
    }

    public void sendOrderStatusUpdateEvent(OrderDto orderDto) {
        try {
            String message = objectMapper.writeValueAsString(orderDto);
            log.info("Publishing 'order-status-updated' event to Kafka topic for Order ID: {}, Status: {}", orderDto.id(), orderDto.status());
            kafkaTemplate.send(KafkaConfig.ORDER_STATUS_TOPIC, orderDto.id().toString(), message);
        } catch (Exception e) {
            log.error("Failed to publish order status event to Kafka topic", e);
        }
    }
}
