package com.dev.fintrack.service;

import com.dev.fintrack.dto.auth.AuthResponse;
import com.dev.fintrack.dto.auth.LoginRequest;
import com.dev.fintrack.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}