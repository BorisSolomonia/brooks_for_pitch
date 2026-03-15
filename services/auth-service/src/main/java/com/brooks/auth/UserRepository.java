package com.brooks.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
  Optional<UserEntity> findByEmail(String email);

  List<UserEntity> findByIdIn(List<UUID> ids);

  @Query("""
      select u from UserEntity u
      where u.deletedAt is null
        and lower(u.status) = 'active'
        and (
          lower(u.handle) like lower(concat('%', :query, '%'))
          or lower(u.displayName) like lower(concat('%', :query, '%'))
          or lower(u.email) like lower(concat('%', :query, '%'))
        )
      order by u.displayName asc
      """)
  List<UserEntity> searchActiveUsers(@Param("query") String query);
}
