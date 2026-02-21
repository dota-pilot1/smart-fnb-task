package com.smartfnb.devspec.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "figma_links")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FigmaLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dev_spec_id", nullable = false)
    private ProjectDevSpec devSpec;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 1000)
    private String url;

    @Column(columnDefinition = "TEXT")
    private String checklist;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public static FigmaLink create(
        ProjectDevSpec devSpec,
        String title,
        String description,
        String url
    ) {
        FigmaLink link = new FigmaLink();
        link.devSpec = devSpec;
        link.title = title;
        link.description = description;
        link.url = url;
        return link;
    }

    public void updateChecklist(String checklist) {
        this.checklist = checklist;
    }
}
