package com.smartfnb.organization.application.dto;

import com.smartfnb.user.domain.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
    @NotNull Role role
) {
}
