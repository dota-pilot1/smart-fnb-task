package com.smartfnb.organization.infrastructure;

import static org.jooq.impl.DSL.*;

import com.smartfnb.organization.application.dto.MemberResponse;
import com.smartfnb.organization.application.dto.OrganizationTreeResponse;
import com.smartfnb.user.domain.Role;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrganizationQueryRepository {

    private final DSLContext dsl;

    /**
     * WITH RECURSIVE CTE로 전체 조직 트리 + 소속 유저를 1회 쿼리로 조회한 뒤
     * Java에서 Map 기반으로 트리를 조립한다.
     */
    public List<OrganizationTreeResponse> findAllTree() {
        // CTE: 재귀적으로 모든 조직을 플랫하게 조회
        var orgTree = name("org_tree");
        var orgTreeCte = orgTree
            .fields("id", "name", "parent_id", "sort_order", "depth")
            .as(
                select(
                    field("id", Long.class),
                    field("name", String.class),
                    field("parent_id", Long.class),
                    field("sort_order", Integer.class),
                    field("depth", Integer.class)
                )
                    .from(table("organizations"))
                    .where(field("parent_id").isNull())
                    .unionAll(
                        select(
                            field("o.id", Long.class),
                            field("o.name", String.class),
                            field("o.parent_id", Long.class),
                            field("o.sort_order", Integer.class),
                            field("o.depth", Integer.class)
                        )
                            .from(table("organizations").as("o"))
                            .join(table(orgTree))
                            .on(field("o.parent_id").eq(field("org_tree.id")))
                    )
            );

        // 메인 쿼리: CTE 결과에 users LEFT JOIN
        var rows = dsl
            .withRecursive(orgTreeCte)
            .select(
                field("org_tree.id", Long.class).as("org_id"),
                field("org_tree.name", String.class).as("org_name"),
                field("org_tree.parent_id", Long.class).as("org_parent_id"),
                field("org_tree.sort_order", Integer.class).as(
                    "org_sort_order"
                ),
                field("org_tree.depth", Integer.class).as("org_depth"),
                field("u.id", Long.class).as("user_id"),
                field("u.name", String.class).as("user_name"),
                field("u.email", String.class).as("user_email"),
                field("u.role", String.class).as("user_role")
            )
            .from(table(orgTree))
            .leftJoin(table("users").as("u"))
            .on(field("u.organization_id").eq(field("org_tree.id")))
            .orderBy(
                field("org_tree.depth").asc(),
                field("org_tree.sort_order").asc(),
                field("u.name").asc()
            )
            .fetch();

        return assembleTree(rows);
    }

    /**
     * 플랫 결과 → 트리 조립
     */
    private List<OrganizationTreeResponse> assembleTree(
        Result<? extends Record> rows
    ) {
        // 1) 조직 노드 수집 (순서 유지)
        Map<Long, TempOrg> orgMap = new LinkedHashMap<>();
        for (Record row : rows) {
            Long orgId = row.get("org_id", Long.class);
            orgMap.computeIfAbsent(orgId, id ->
                new TempOrg(
                    id,
                    row.get("org_name", String.class),
                    row.get("org_parent_id", Long.class),
                    row.get("org_sort_order", Integer.class),
                    row.get("org_depth", Integer.class)
                )
            );

            // 유저가 있으면 추가
            Long userId = row.get("user_id", Long.class);
            if (userId != null) {
                orgMap
                    .get(orgId)
                    .members.add(
                        new MemberResponse(
                            userId,
                            row.get("user_name", String.class),
                            row.get("user_email", String.class),
                            Role.valueOf(row.get("user_role", String.class))
                        )
                    );
            }
        }

        // 2) 부모-자식 연결
        List<TempOrg> roots = new ArrayList<>();
        for (TempOrg org : orgMap.values()) {
            if (org.parentId == null) {
                roots.add(org);
            } else {
                TempOrg parent = orgMap.get(org.parentId);
                if (parent != null) {
                    parent.children.add(org);
                }
            }
        }

        // 3) DTO 변환
        return roots.stream().map(this::toResponse).toList();
    }

    private OrganizationTreeResponse toResponse(TempOrg org) {
        return new OrganizationTreeResponse(
            org.id,
            org.name,
            org.sortOrder,
            org.depth,
            org.children.stream().map(this::toResponse).toList(),
            org.members
        );
    }

    /** 조립용 임시 객체 */
    private static class TempOrg {

        final Long id;
        final String name;
        final Long parentId;
        final int sortOrder;
        final int depth;
        final List<TempOrg> children = new ArrayList<>();
        final List<MemberResponse> members = new ArrayList<>();

        TempOrg(Long id, String name, Long parentId, int sortOrder, int depth) {
            this.id = id;
            this.name = name;
            this.parentId = parentId;
            this.sortOrder = sortOrder;
            this.depth = depth;
        }
    }
}
