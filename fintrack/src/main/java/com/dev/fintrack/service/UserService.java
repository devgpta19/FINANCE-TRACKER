package com.dev.fintrack.service;

import com.dev.fintrack.dto.user.UserResponse;
import com.dev.fintrack.dto.user.UserStatusUpdateRequest;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUserStatus(Long id, UserStatusUpdateRequest request);

    void deleteUser(Long id);
}