package com.brooks.pins.client;

import com.brooks.pins.SocialGraphView;
import java.util.UUID;

/**
 * Client interface for querying the social service's relationship graph.
 * This abstraction allows for easy mocking in tests and potential
 * implementation changes (e.g., adding caching, circuit breakers).
 */
public interface SocialGraphClient {
  /**
   * Fetches the social graph view between a viewer and a subject user.
   *
   * @param viewerId The user viewing the content
   * @param subjectId The user being viewed
   * @return Social graph view containing relationship information
   */
  SocialGraphView fetchGraphView(UUID viewerId, UUID subjectId);
}
