package com.brooks.social;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RelationshipPreferenceRepository extends JpaRepository<RelationshipPreferenceEntity, UUID> {
  Optional<RelationshipPreferenceEntity> findByViewerIdAndSubjectId(UUID viewerId, UUID subjectId);
}
