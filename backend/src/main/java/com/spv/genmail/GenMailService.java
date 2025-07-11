package com.spv.genmail;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GenMailService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient;

    public GenMailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        //Build the prompt
        String prompt = buildPrompt(emailRequest);
        //Craft the prompt to match API Format
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text" , prompt)
                        })
                }
        );

        //Make Request and Get Response
        String response = webClient.post()
                .uri(geminiApiUrl+geminiApiKey)
                .header("Content-Type" , "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //Extract relevant text and return as Response
        return extractResponseContent(response);


    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }catch (Exception e){
            return "Error processing Request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(
                "You're an intelligent email assistant. Your job is to craft thoughtful, context-aware replies to emails.\n" +
                        "Analyze the sender's message, tone, and intent. Understand the emotional context (e.g. friendly, angry, urgent, apologetic) and respond appropriately.\n" +
                        "Please write a professional, natural-sounding reply. Match the tone specified below, unless the sender’s tone requires adaptation.\n" +
                        "Do NOT include a subject line.\n\n"
        );
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Preferred Reply tone: ").append(emailRequest.getTone()).append("\n\n");
        }
        prompt.append("\n Original email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();

    }
}
