package com.smartfnb.organization.presentation;

import com.smartfnb.organization.application.OrganizationService;
import com.smartfnb.organization.application.dto.*;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<OrganizationTreeResponse> createRoot(
        @Valid @RequestBody CreateOrganizationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(organizationService.createRoot(request));
    }

    @PostMapping("/{id}/children")
    public ResponseEntity<OrganizationTreeResponse> createChild(
        @PathVariable Long id,
        @Valid @RequestBody CreateOrganizationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(organizationService.createChild(id, request));
    }

    @GetMapping
    public ResponseEntity<List<OrganizationTreeResponse>> findAll() {
        return ResponseEntity.ok(organizationService.findAll());
    }

    @PutMapping("/{id}/name")
    public ResponseEntity<Void> updateName(
        @PathVariable Long id,
        @Valid @RequestBody UpdateNameRequest request
    ) {
        organizationService.updateName(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        organizationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // === 유저 관리 ===

    @PostMapping("/{id}/members")
    public ResponseEntity<Void> assignUser(
        @PathVariable Long id,
        @Valid @RequestBody AssignUserRequest request
    ) {
        organizationService.assignUser(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/members/{userId}")
    public ResponseEntity<Void> unassignUser(@PathVariable Long userId) {
        organizationService.unassignUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/members/{userId}")
    public ResponseEntity<MemberResponse> findUser(@PathVariable Long userId) {
        return ResponseEntity.ok(organizationService.findUser(userId));
    }

    @PutMapping("/members/{userId}/role")
    public ResponseEntity<MemberResponse> updateUserRole(
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        return ResponseEntity.ok(organizationService.updateUserRole(userId, request));
    }

    @GetMapping("/unassigned-users")
    public ResponseEntity<List<MemberResponse>> findUnassignedUsers() {
        return ResponseEntity.ok(organizationService.findUnassignedUsers());
    }
}
