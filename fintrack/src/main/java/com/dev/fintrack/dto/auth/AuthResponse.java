package com.dev.fintrack.dto.auth;

public class AuthResponse {

    private String token;
    private String message;
    private String role;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, String role, String email) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
    
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}