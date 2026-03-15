package com.brooks.social;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<FollowEntity, UUID> {
  Optional<FollowEntity> findByFollowerIdAndFolloweeId(UUID followerId, UUID followeeId);
  List<FollowEntity> findByFollowerIdAndStatusOrderByIdDesc(UUID followerId, FollowStatus status);
  List<FollowEntity> findByFolloweeIdAndStatusOrderByIdDesc(UUID followeeId, FollowStatus status);
}
