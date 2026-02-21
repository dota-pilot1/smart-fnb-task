package com.smartfnb.devspec.presentation;

import com.smartfnb.devspec.application.DevSpecService;
import com.smartfnb.devspec.application.dto.*;
import com.smartfnb.devspec.domain.ContentType;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devspec")
@RequiredArgsConstructor
public class DevSpecController {

    private final DevSpecService devSpecService;

    @PostMapping("/projects")
    public ResponseEntity<DevSpecTreeResponse> createProject(
        @Valid @RequestBody CreateProjectRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            devSpecService.createProject(request)
        );
    }

    @GetMapping("/projects")
    public ResponseEntity<List<DevSpecTreeResponse>> findAllProjectSpecs() {
        return ResponseEntity.ok(devSpecService.findAllProjectSpecs());
    }

    @GetMapping("/projects/{id}/tree")
    public ResponseEntity<DevSpecTreeResponse> findProjectTree(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(devSpecService.findProjectTree(id));
    }

    @PostMapping("/projects/{id}/pages")
    public ResponseEntity<DevSpecTreeResponse> createPage(
        @PathVariable Long id,
        @Valid @RequestBody CreatePageRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            devSpecService.createPage(id, request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DevSpecDetailResponse> findDetail(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(devSpecService.findDetail(id));
    }

    @PutMapping("/{id}/name")
    public ResponseEntity<Void> updateName(
        @PathVariable Long id,
        @Valid @RequestBody UpdateNameRequest request
    ) {
        devSpecService.updateName(id, request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody UpdateStatusRequest request
    ) {
        devSpecService.updateStatus(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        devSpecService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/figma-links")
    public ResponseEntity<FigmaLinkResponse> createFigmaLink(
        @PathVariable Long id,
        @Valid @RequestBody CreateFigmaLinkRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            devSpecService.createFigmaLink(id, request)
        );
    }

    @GetMapping("/{id}/figma-links")
    public ResponseEntity<List<FigmaLinkResponse>> findFigmaLinks(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(devSpecService.findFigmaLinks(id));
    }

    @GetMapping("/figma-links/{linkId}")
    public ResponseEntity<FigmaLinkResponse> findFigmaLink(
        @PathVariable Long linkId
    ) {
        return ResponseEntity.ok(devSpecService.findFigmaLink(linkId));
    }

    @PutMapping("/figma-links/{linkId}/checklist")
    public ResponseEntity<FigmaLinkResponse> updateFigmaLinkChecklist(
        @PathVariable Long linkId,
        @RequestBody UpdateContentRequest request
    ) {
        return ResponseEntity.ok(
            devSpecService.updateFigmaLinkChecklist(linkId, request)
        );
    }

    @DeleteMapping("/{id}/figma-links/{linkId}")
    public ResponseEntity<Void> deleteFigmaLink(
        @PathVariable Long id,
        @PathVariable Long linkId
    ) {
        devSpecService.deleteFigmaLink(linkId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/content/{contentType}")
    public ResponseEntity<DevSpecContentResponse> findContent(
        @PathVariable Long id,
        @PathVariable ContentType contentType
    ) {
        return ResponseEntity.ok(devSpecService.findContent(id, contentType));
    }

    @PutMapping("/{id}/content/{contentType}")
    public ResponseEntity<DevSpecContentResponse> saveContent(
        @PathVariable Long id,
        @PathVariable ContentType contentType,
        @RequestBody UpdateContentRequest request
    ) {
        return ResponseEntity.ok(
            devSpecService.saveContent(id, contentType, request)
        );
    }
}
