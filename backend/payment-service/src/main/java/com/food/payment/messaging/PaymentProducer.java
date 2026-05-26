package com.food.payment.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.food.payment.config.KafkaConfig;
import com.food.payment.dto.PaymentDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Event producer formatting payment outcomes into JSON messages and broadcasting to Kafka nodes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendPaymentEvent(PaymentDto dto) {
        try {
            String message = objectMapper.writeValueAsString(dto);
            
            if (dto.status().name().equals("SUCCESS")) {
                log.info("Publishing 'payment-completed' event to Kafka for Order ID: {}", dto.orderId());
                kafkaTemplate.send(KafkaConfig.PAYMENT_COMPLETED_TOPIC, dto.orderId().toString(), message);
            } else {
                log.warn("Publishing 'payment-failed' event to Kafka for Order ID: {}", dto.orderId());
                kafkaTemplate.send(KafkaConfig.PAYMENT_FAILED_TOPIC, dto.orderId().toString(), message);
            }
        } catch (Exception e) {
            log.error("Failed to publish transaction event outcome to Kafka topic", e);
        }
    }
}
