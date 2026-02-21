package com.dxline.ohs.dxmall.devspec.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_dev_specs",
        uniqueConstraints = @UniqueConstraint(columnNames = {"parent_id", "name"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectDevSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ProjectDevSpec parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProjectDevSpec> children = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SpecType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SpecStatus status;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private int depth;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public static ProjectDevSpec createRoot(String name) {
        ProjectDevSpec spec = new ProjectDevSpec();
        spec.name = name;
        spec.parent = null;
        spec.type = SpecType.PROJECT;
        spec.status = SpecStatus.TODO;
        spec.sortOrder = 0;
        spec.depth = 0;
        return spec;
    }

    public static ProjectDevSpec createChild(String name, ProjectDevSpec parent, SpecType type, int sortOrder) {
        ProjectDevSpec spec = new ProjectDevSpec();
        spec.name = name;
        spec.parent = parent;
        spec.type = type;
        spec.status = SpecStatus.TODO;
        spec.sortOrder = sortOrder;
        spec.depth = parent.depth + 1;
        parent.children.add(spec);
        return spec;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void updateStatus(SpecStatus status) {
        this.status = status;
    }

    public void updateName(String name) {
        this.name = name;
    }
}
