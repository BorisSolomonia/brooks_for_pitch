package com.brooks.social;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepository extends JpaRepository<FriendshipEntity, UUID> {
  Optional<FriendshipEntity> findByUserIdAndFriendId(UUID userId, UUID friendId);
  Optional<FriendshipEntity> findByUserIdAndFriendIdAndStatus(UUID userId, UUID friendId, FriendshipStatus status);
  List<FriendshipEntity> findByUserIdAndStatusOrderByAcceptedAtDesc(UUID userId, FriendshipStatus status);
  List<FriendshipEntity> findByFriendIdAndStatusOrderByRequestedAtDesc(UUID friendId, FriendshipStatus status);
  List<FriendshipEntity> findByUserIdAndStatusOrderByRequestedAtDesc(UUID userId, FriendshipStatus status);
}
