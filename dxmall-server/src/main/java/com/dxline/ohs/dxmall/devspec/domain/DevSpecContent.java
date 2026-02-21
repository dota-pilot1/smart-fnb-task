package com.dxline.ohs.dxmall.devspec.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dev_spec_contents",
        uniqueConstraints = @UniqueConstraint(columnNames = {"dev_spec_id", "content_type"}))
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

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public static DevSpecContent create(ProjectDevSpec devSpec, ContentType contentType, String content) {
        DevSpecContent specContent = new DevSpecContent();
        specContent.devSpec = devSpec;
        specContent.contentType = contentType;
        specContent.content = content;
        return specContent;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
