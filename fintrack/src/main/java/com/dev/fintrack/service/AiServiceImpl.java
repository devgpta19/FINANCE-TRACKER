package com.dev.fintrack.service;

import com.dev.fintrack.dto.ai.AiRequest;
import com.dev.fintrack.dto.ai.AiResponse;
import com.dev.fintrack.dto.dashboard.CategorySummaryResponse;
import com.dev.fintrack.dto.dashboard.DashboardSummaryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiServiceImpl implements AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceImpl.class);
    private final ChatClient chatClient;
    private final DashboardService dashboardService;

    @Autowired
    public AiServiceImpl(ChatClient.Builder chatClientBuilder, DashboardService dashboardService) {
        this.chatClient = chatClientBuilder
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .build();
        this.dashboardService = dashboardService;
    }

    @Override
    public AiResponse chat(AiRequest request) {
        // Fetch financial context
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary();
        List<CategorySummaryResponse> categories = dashboardService.getCategorySummary();

        String categoryContext = categories.stream()
                .map(c -> String.format("- %s: %.2f", c.getCategory(), c.getTotal()))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
                You are a helpful Financial Assistant for the FinTrack application.
                You have access to the user's current financial summary:
                - Total Income: {totalIncome}
                - Total Expense: {totalExpense}
                - Net Balance: {netBalance}
                
                Expense Category Breakdown:
                {categoryContext}
                
                Provide concise, insightful, and helpful advice based on this data. 
                If the user asks a personal question not related to finance, politely redirect them.
                Answer the following user query:
                """;

        // Using ChatClient fluent API with logging
        logger.info("Sending request to Gemini AI...");
        try {
            String response = chatClient.prompt()
                    .system(s -> s.text(systemPrompt)
                            .param("totalIncome", summary.getTotalIncome())
                            .param("totalExpense", summary.getTotalExpense())
                            .param("netBalance", summary.getNetBalance())
                            .param("categoryContext", categoryContext.isEmpty() ? "No data available" : categoryContext))
                    .user(request.getMessage())
                    .call()
                    .content();
            
            logger.info("Received response from Gemini AI.");
            return new AiResponse(response);
        } catch (Exception e) {
            logger.error("Error connecting to Gemini AI: {}", e.getMessage(), e);
            throw new RuntimeException("AI Assistant is currently unavailable. Please try again later.");
        }
    }
}
