package com.community.news.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.CreateQueueRequest;
import software.amazon.awssdk.services.sqs.model.GetQueueUrlRequest;
import software.amazon.awssdk.services.sqs.model.QueueDoesNotExistException;

@Component
public class SqsQueueInitializer {

    private final SqsClient sqsClient;
    private final String queueName;
    private final boolean autoCreateQueue;

    public SqsQueueInitializer(SqsClient sqsClient,
                               @Value("${aws.sqs.queue-name}") String queueName,
                               @Value("${aws.sqs.auto-create-queue:false}") boolean autoCreateQueue) {
        if (queueName == null || queueName.isBlank()) {
            throw new IllegalStateException("aws.sqs.queue-name must be set");
        }
        this.sqsClient = sqsClient;
        this.queueName = queueName;
        this.autoCreateQueue = autoCreateQueue;
    }

    @PostConstruct
    public void ensureQueueExists() {
        if (!autoCreateQueue) {
            return;
        }
        if (queueExists()) {
            return;
        }
        sqsClient.createQueue(CreateQueueRequest.builder()
                .queueName(queueName)
                .build());
    }

    private boolean queueExists() {
        try {
            sqsClient.getQueueUrl(GetQueueUrlRequest.builder()
                    .queueName(queueName)
                    .build());
            return true;
        } catch (QueueDoesNotExistException ex) {
            return false;
        }
    }
}

