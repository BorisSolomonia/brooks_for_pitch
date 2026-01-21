package com.brooks.pins.client;

import java.util.List;
import java.util.UUID;

/**
 * Client interface for querying the lists service.
 * Used to check user membership in friend/follower lists for ACL evaluation.
 */
public interface ListsClient {
  /**
   * Checks if a user is a member of any of the specified lists.
   *
   * @param userId The user to check
   * @param listIds The list IDs to check membership in
   * @return true if the user is in at least one of the lists
   */
  boolean isUserInAnyList(UUID userId, List<String> listIds);
}
