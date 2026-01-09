package com.emtps.auth.service;

public interface KafkaProducerService {
    void sendMessage(String topic, Object message);
}
