package com.dev.fintrack.dto.user;

import com.dev.fintrack.enums.UserStatus;

public class UserStatusUpdateRequest {

    private UserStatus status;

    public UserStatusUpdateRequest() {
    }

    public UserStatusUpdateRequest(UserStatus status) {
        this.status = status;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}