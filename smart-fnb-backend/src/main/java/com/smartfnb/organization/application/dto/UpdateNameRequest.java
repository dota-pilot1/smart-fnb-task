package com.smartfnb.organization.application.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateNameRequest(
    @NotBlank String name
) {
}
