package com.community.news.service;

import com.community.news.dto.ImageResizeEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.GetQueueUrlRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@Service
public class SqsProducer {

    private final SqsClient sqsClient;
    private final ObjectMapper objectMapper;
    private final String queueName = "ImageResizeTaskQueue";

    public SqsProducer(SqsClient sqsClient, ObjectMapper objectMapper) {
        this.sqsClient = sqsClient;
        this.objectMapper = objectMapper;
    }

    public void publishImageResizeEvent(ImageResizeEvent event) {
        try {
            // 1. Get the Queue URL (SQS requires the URL, not just the name, to send messages)
            String queueUrl = sqsClient.getQueueUrl(GetQueueUrlRequest.builder()
                    .queueName(queueName)
                    .build()).queueUrl();

            // 2. Convert the event DTO to a JSON string
            String messageBody = objectMapper.writeValueAsString(event);

            // 3. Send the message to SQS
            sqsClient.sendMessage(SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(messageBody)
                    .build());
            
            System.out.println("DEBUG: Pushed event to SQS for post: " + event.getPostId());

        } catch (JsonProcessingException e) {
            System.err.println("Failed to serialize ImageResizeEvent to JSON");
            e.printStackTrace();
        }
    }
}

