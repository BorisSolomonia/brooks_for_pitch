package com.brooks.app.social;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepository extends JpaRepository<FriendshipEntity, UUID> {
  Optional<FriendshipEntity> findByUserIdAndFriendId(UUID userId, UUID friendId);
}
