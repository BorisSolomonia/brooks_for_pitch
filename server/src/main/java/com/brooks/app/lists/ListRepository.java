package com.brooks.app.lists;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListRepository extends JpaRepository<ListEntity, UUID> {
}
