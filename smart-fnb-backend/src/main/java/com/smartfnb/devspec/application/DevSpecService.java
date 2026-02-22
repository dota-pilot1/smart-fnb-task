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
    private final FigmaLinkRepository figmaLinkRepository;

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
            .orElse(new DevSpecContentResponse(null, contentType, null, "", 0));
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

    @Transactional
    public FigmaLinkResponse createFigmaLink(
        Long devSpecId,
        CreateFigmaLinkRequest request
    ) {
        ProjectDevSpec spec = findSpecOrThrow(devSpecId);
        FigmaLink link = FigmaLink.create(
            spec,
            request.title(),
            request.description(),
            request.url()
        );
        figmaLinkRepository.save(link);
        return FigmaLinkResponse.from(link);
    }

    public List<FigmaLinkResponse> findFigmaLinks(Long devSpecId) {
        ProjectDevSpec spec = findSpecOrThrow(devSpecId);
        return figmaLinkRepository
            .findByDevSpec(spec)
            .stream()
            .map(FigmaLinkResponse::from)
            .toList();
    }

    public FigmaLinkResponse findFigmaLink(Long linkId) {
        FigmaLink link = figmaLinkRepository
            .findById(linkId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 Figma 링크입니다. id=" + linkId
                )
            );
        return FigmaLinkResponse.from(link);
    }

    @Transactional
    public FigmaLinkResponse updateFigmaLinkChecklist(
        Long linkId,
        UpdateContentRequest request
    ) {
        FigmaLink link = figmaLinkRepository
            .findById(linkId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 Figma 링크입니다. id=" + linkId
                )
            );
        link.updateChecklist(request.content());
        return FigmaLinkResponse.from(link);
    }

    @Transactional
    public void deleteFigmaLink(Long linkId) {
        figmaLinkRepository
            .findById(linkId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 Figma 링크입니다. id=" + linkId
                )
            );
        figmaLinkRepository.deleteById(linkId);
    }

    // === 노트 섹션 ===

    public List<DevSpecContentResponse> findNoteSections(Long devSpecId) {
        ProjectDevSpec spec = findSpecOrThrow(devSpecId);
        return devSpecContentRepository
            .findByDevSpecAndContentTypeOrderBySortOrder(spec, ContentType.NOTE)
            .stream()
            .map(DevSpecContentResponse::from)
            .toList();
    }

    @Transactional
    public DevSpecContentResponse createNoteSection(
        Long devSpecId,
        SaveNoteSectionRequest request
    ) {
        ProjectDevSpec spec = findSpecOrThrow(devSpecId);
        int nextSort = devSpecContentRepository
            .findByDevSpecAndContentTypeOrderBySortOrder(spec, ContentType.NOTE)
            .size();
        DevSpecContent section = DevSpecContent.createNote(
            spec,
            request.title(),
            request.content(),
            nextSort
        );
        devSpecContentRepository.save(section);
        return DevSpecContentResponse.from(section);
    }

    @Transactional
    public DevSpecContentResponse updateNoteSection(
        Long sectionId,
        SaveNoteSectionRequest request
    ) {
        DevSpecContent section = devSpecContentRepository
            .findById(sectionId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 섹션입니다. id=" + sectionId
                )
            );
        if (request.title() != null) section.updateTitle(request.title());
        if (request.content() != null) section.updateContent(request.content());
        return DevSpecContentResponse.from(section);
    }

    @Transactional
    public void deleteNoteSection(Long sectionId) {
        devSpecContentRepository
            .findById(sectionId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "존재하지 않는 섹션입니다. id=" + sectionId
                )
            );
        devSpecContentRepository.deleteById(sectionId);
    }

    @Transactional
    public List<DevSpecContentResponse> reorderNoteSections(
        Long devSpecId,
        ReorderRequest request
    ) {
        ProjectDevSpec spec = findSpecOrThrow(devSpecId);
        List<DevSpecContent> sections =
            devSpecContentRepository.findByDevSpecAndContentTypeOrderBySortOrder(
                spec,
                ContentType.NOTE
            );

        for (int i = 0; i < request.ids().size(); i++) {
            Long targetId = request.ids().get(i);
            sections
                .stream()
                .filter(s -> s.getId().equals(targetId))
                .findFirst()
                .ifPresent(s ->
                    s.updateSortOrder(request.ids().indexOf(targetId))
                );
        }

        return sections
            .stream()
            .sorted((a, b) -> a.getSortOrder() - b.getSortOrder())
            .map(DevSpecContentResponse::from)
            .toList();
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
