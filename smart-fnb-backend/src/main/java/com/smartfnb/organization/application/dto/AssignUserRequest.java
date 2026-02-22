package com.smartfnb.organization.application.dto;

import jakarta.validation.constraints.NotNull;

public record AssignUserRequest(
    @NotNull Long userId
) {
}
