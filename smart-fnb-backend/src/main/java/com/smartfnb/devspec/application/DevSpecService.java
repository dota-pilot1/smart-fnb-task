package com.smartfnb.devspec.application;

import com.smartfnb.devspec.application.dto.*;
import com.smartfnb.devspec.domain.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DevSpecService {

    private final DevSpecRepository devSpecRepository;
    private final DevSpecContentRepository devSpecContentRepository;

    @Transactional
    public DevSpecTreeResponse createProject(CreateProjectRequest request) {
        ProjectDevSpec project = ProjectDevSpec.createRoot(request.name());
        devSpecRepository.save(project);
        return DevSpecTreeResponse.from(project);
    }

    @Transactional
    public DevSpecTreeResponse createPage(
        Long projectId,
        CreatePageRequest request
    ) {
        ProjectDevSpec project = findSpecOrThrow(projectId);
        if (project.getType() != SpecType.PROJECT) {
            throw new IllegalArgumentException(
                "페이지는 프로젝트 하위에만 추가할 수 있습니다."
            );
        }
        int nextSortOrder = project.getChildren().size();
        ProjectDevSpec page = ProjectDevSpec.createChild(
            request.name(),
            project,
            SpecType.PAGE,
            nextSortOrder
        );
        devSpecRepository.save(page);
        return DevSpecTreeResponse.from(page);
    }

    public List<DevSpecTreeResponse> findAllProjectSpecs() {
        return devSpecRepository
            .findByParentIsNull()
            .stream()
            .map(DevSpecTreeResponse::from)
            .toList();
    }

    public DevSpecTreeResponse findProjectTree(Long projectId) {
        ProjectDevSpec project = findSpecOrThrow(projectId);
        return DevSpecTreeResponse.from(project);
    }

    public DevSpecDetailResponse findDetail(Long id) {
        ProjectDevSpec spec = findSpecOrThrow(id);
        List<DevSpecContentResponse> contents = devSpecContentRepository
            .findByDevSpec(spec)
            .stream()
            .map(DevSpecContentResponse::from)
            .toList();
        return DevSpecDetailResponse.from(spec, contents);
    }

    @Transactional
    public void updateName(Long id, UpdateNameRequest request) {
        ProjectDevSpec spec = findSpecOrThrow(id);
        spec.updateName(request.name());
    }

    @Transactional
    public void updateStatus(Long id, UpdateStatusRequest request) {
        ProjectDevSpec spec = findSpecOrThrow(id);
        spec.updateStatus(request.status());
    }

    @Transactional
    public void delete(Long id) {
        ProjectDevSpec spec = findSpecOrThrow(id);
        devSpecRepository.deleteById(spec.getId());
    }

    public DevSpecContentResponse findContent(
        Long id,
        ContentType contentType
    ) {
        ProjectDevSpec spec = findSpecOrThrow(id);
        return devSpecContentRepository
            .findByDevSpecAndContentType(spec, contentType)
            .map(DevSpecContentResponse::from)
            .orElse(new DevSpecContentResponse(null, contentType, ""));
    }

    @Transactional
    public DevSpecContentResponse saveContent(
        Long id,
        ContentType contentType,
        UpdateContentRequest request
    ) {
        ProjectDevSpec spec = findSpecOrThrow(id);
        DevSpecContent content = devSpecContentRepository
            .findByDevSpecAndContentType(spec, contentType)
            .map(existing -> {
                existing.updateContent(request.content());
                return existing;
            })
            .orElseGet(() -> {
                DevSpecContent newContent = DevSpecContent.create(
                    spec,
                    contentType,
                    request.content()
                );
                return devSpecContentRepository.save(newContent);
            });
        return DevSpecContentResponse.from(content);
    }

    private ProjectDevSpec findSpecOrThrow(Long id) {
        return devSpecRepository
            .findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 항목입니다. id=" + id
                )
            );
    }
}
