package com.smartfnb.organization.application;

import com.smartfnb.organization.application.dto.*;
import com.smartfnb.organization.domain.Organization;
import com.smartfnb.organization.domain.OrganizationRepository;
import com.smartfnb.organization.infrastructure.OrganizationQueryRepository;
import com.smartfnb.user.domain.User;
import com.smartfnb.user.domain.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationQueryRepository organizationQueryRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrganizationTreeResponse createRoot(
        CreateOrganizationRequest request
    ) {
        Organization org = Organization.createRoot(request.name());
        organizationRepository.save(org);
        return OrganizationTreeResponse.from(org);
    }

    @Transactional
    public OrganizationTreeResponse createChild(
        Long parentId,
        CreateOrganizationRequest request
    ) {
        Organization parent = findOrThrow(parentId);
        int nextSort = parent.getChildren().size();
        Organization child = Organization.createChild(
            request.name(),
            parent,
            nextSort
        );
        organizationRepository.save(child);
        return OrganizationTreeResponse.from(child);
    }

    public List<OrganizationTreeResponse> findAll() {
        return organizationQueryRepository.findAllTree();
    }

    @Transactional
    public void updateName(Long id, UpdateNameRequest request) {
        Organization org = findOrThrow(id);
        org.updateName(request.name());
    }

    @Transactional
    public void delete(Long id) {
        Organization org = findOrThrow(id);
        // 소속 유저들의 조직을 null로 해제
        for (User member : org.getMembers()) {
            member.updateOrganization(null);
        }
        organizationRepository.deleteById(org.getId());
    }

    // === 유저 관리 ===

    @Transactional
    public void assignUser(Long orgId, AssignUserRequest request) {
        Organization org = findOrThrow(orgId);
        User user = userRepository
            .findById(request.userId())
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 유저입니다. id=" + request.userId()
                )
            );
        user.updateOrganization(org);
    }

    @Transactional
    public void unassignUser(Long userId) {
        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 유저입니다. id=" + userId
                )
            );
        user.updateOrganization(null);
    }

    public MemberResponse findUser(Long userId) {
        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 유저입니다. id=" + userId
                )
            );
        return MemberResponse.from(user);
    }

    @Transactional
    public MemberResponse updateUserRole(
        Long userId,
        UpdateUserRoleRequest request
    ) {
        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 유저입니다. id=" + userId
                )
            );
        user.updateRole(request.role());
        return MemberResponse.from(user);
    }

    public List<MemberResponse> findUnassignedUsers() {
        return userRepository
            .findByOrganizationIsNull()
            .stream()
            .map(MemberResponse::from)
            .toList();
    }

    private Organization findOrThrow(Long id) {
        return organizationRepository
            .findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 조직입니다. id=" + id
                )
            );
    }
}
