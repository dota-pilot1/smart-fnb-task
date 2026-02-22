package com.smartfnb.devspec.application.dto;

import java.util.List;

public record ReorderRequest(
        List<Long> ids
) {
}
