package com.smartfnb.organization.domain;

import com.smartfnb.user.domain.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
    name = "organizations",
    uniqueConstraints = @UniqueConstraint(columnNames = { "parent_id", "name" })
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Organization parent;

    @OneToMany(
        mappedBy = "parent",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @OrderBy("sortOrder ASC")
    private List<Organization> children = new ArrayList<>();

    @OneToMany(mappedBy = "organization")
    @OrderBy("name ASC")
    private List<User> members = new ArrayList<>();

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private int depth;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public static Organization createRoot(String name) {
        Organization org = new Organization();
        org.name = name;
        org.parent = null;
        org.sortOrder = 0;
        org.depth = 0;
        return org;
    }

    public static Organization createChild(
        String name,
        Organization parent,
        int sortOrder
    ) {
        Organization org = new Organization();
        org.name = name;
        org.parent = parent;
        org.sortOrder = sortOrder;
        org.depth = parent.depth + 1;
        parent.children.add(org);
        return org;
    }

    public void updateName(String name) {
        this.name = name;
    }
}
