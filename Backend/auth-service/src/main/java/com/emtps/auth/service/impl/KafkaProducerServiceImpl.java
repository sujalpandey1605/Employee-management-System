package com.emtps.auth.service.impl;

import com.emtps.auth.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerServiceImpl implements KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendMessage(String topic, Object message) {
        log.info("Sending message to Kafka topic {}: {}", topic, message);
        kafkaTemplate.send(topic, message);
    }
}
