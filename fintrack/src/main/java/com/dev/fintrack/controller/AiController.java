package com.dev.fintrack.controller;

import com.dev.fintrack.dto.ai.AiRequest;
import com.dev.fintrack.dto.ai.AiResponse;
import com.dev.fintrack.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AiResponse> chat(@RequestBody AiRequest request) {
        return ResponseEntity.ok(aiService.chat(request));
    }
}
