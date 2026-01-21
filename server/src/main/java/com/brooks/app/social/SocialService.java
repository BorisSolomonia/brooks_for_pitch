package com.brooks.app.social;

import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class SocialService {
  public FollowResponse follow(UUID userId) {
    return new FollowResponse(UUID.randomUUID().toString(), "ACTIVE");
  }

  public FriendRequestResponse requestFriend(UUID userId) {
    return new FriendRequestResponse(UUID.randomUUID().toString(), "PENDING");
  }

  public FriendshipResponse acceptFriend(UUID requestId) {
    return new FriendshipResponse(UUID.randomUUID().toString(), "ACCEPTED");
  }

  public void updatePreferences(UUID userId, RelationshipPreferencesRequest request) {
  }

  public void blockUser(UUID userId) {
  }
}
