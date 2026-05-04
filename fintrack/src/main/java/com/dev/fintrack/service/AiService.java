package com.dev.fintrack.service;

import com.dev.fintrack.dto.ai.AiRequest;
import com.dev.fintrack.dto.ai.AiResponse;

public interface AiService {
    AiResponse chat(AiRequest request);
}
