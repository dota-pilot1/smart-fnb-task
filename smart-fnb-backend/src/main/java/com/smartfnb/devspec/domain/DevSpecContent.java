package com.smartfnb.devspec.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "dev_spec_contents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DevSpecContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dev_spec_id", nullable = false)
    private ProjectDevSpec devSpec;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private ContentType contentType;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer sortOrder = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public static DevSpecContent create(
        ProjectDevSpec devSpec,
        ContentType contentType,
        String content
    ) {
        DevSpecContent specContent = new DevSpecContent();
        specContent.devSpec = devSpec;
        specContent.contentType = contentType;
        specContent.content = content;
        return specContent;
    }

    public static DevSpecContent createNote(
        ProjectDevSpec devSpec,
        String title,
        String content,
        int sortOrder
    ) {
        DevSpecContent specContent = new DevSpecContent();
        specContent.devSpec = devSpec;
        specContent.contentType = ContentType.NOTE;
        specContent.title = title;
        specContent.content = content;
        specContent.sortOrder = sortOrder;
        return specContent;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }
}
