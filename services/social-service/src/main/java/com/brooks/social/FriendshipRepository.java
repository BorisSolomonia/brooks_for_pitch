package com.brooks.social;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepository extends JpaRepository<FriendshipEntity, UUID> {
  Optional<FriendshipEntity> findByUserIdAndFriendId(UUID userId, UUID friendId);
  Optional<FriendshipEntity> findByUserIdAndFriendIdAndStatus(UUID userId, UUID friendId, FriendshipStatus status);
}
