package com.smartfnb.user.domain;

import com.smartfnb.organization.domain.Organization;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private Email email;

    @Embedded
    private Password password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private User(Email email, Password password, String name, Role role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    public static User create(
        String email,
        String rawPassword,
        String name,
        PasswordEncoder encoder
    ) {
        return new User(
            new Email(email),
            Password.encode(rawPassword, encoder),
            name,
            Role.USER
        );
    }

    public boolean checkPassword(String rawPassword, PasswordEncoder encoder) {
        return this.password.matches(rawPassword, encoder);
    }

    public void updateRole(Role role) {
        this.role = role;
    }

    public void updateOrganization(Organization organization) {
        this.organization = organization;
    }
}
