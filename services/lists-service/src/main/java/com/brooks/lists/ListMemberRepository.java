package com.brooks.lists;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListMemberRepository extends JpaRepository<ListMemberEntity, UUID> {
  List<ListMemberEntity> findByListId(UUID listId);
  boolean existsByListIdAndMemberUserId(UUID listId, UUID memberUserId);
}
