package com.food.order.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Kafka topic initialization bean for real-time microservices event streams.
 */
@Configuration
public class KafkaConfig {

    public static final String ORDER_PLACED_TOPIC = "order-placed";
    public static final String ORDER_STATUS_TOPIC = "order-status-updated";

    @Bean
    public NewTopic orderPlacedTopic() {
        return TopicBuilder.name(ORDER_PLACED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic orderStatusTopic() {
        return TopicBuilder.name(ORDER_STATUS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
