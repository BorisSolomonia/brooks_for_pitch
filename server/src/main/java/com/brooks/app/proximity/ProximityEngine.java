package com.brooks.app.proximity;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProximityEngine {
  public List<UUID> selectCandidates(String bucket, int limit) {
    return Collections.emptyList();
  }
}
