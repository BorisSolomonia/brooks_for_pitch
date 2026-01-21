package com.brooks.app.social;

import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SocialController {
  private final SocialService socialService;

  public SocialController(SocialService socialService) {
    this.socialService = socialService;
  }

  @PostMapping("/follow/{userId}")
  public ResponseEntity<FollowResponse> follow(@PathVariable UUID userId) {
    return ResponseEntity.ok(socialService.follow(userId));
  }

  @PostMapping("/friends/request/{userId}")
  public ResponseEntity<FriendRequestResponse> requestFriend(@PathVariable UUID userId) {
    return ResponseEntity.ok(socialService.requestFriend(userId));
  }

  @PostMapping("/friends/accept/{requestId}")
  public ResponseEntity<FriendshipResponse> acceptFriend(@PathVariable UUID requestId) {
    return ResponseEntity.ok(socialService.acceptFriend(requestId));
  }

  @PutMapping("/relationships/{userId}/preferences")
  public ResponseEntity<Void> updatePreferences(
      @PathVariable UUID userId,
      @RequestBody RelationshipPreferencesRequest request
  ) {
    socialService.updatePreferences(userId, request);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/block/{userId}")
  public ResponseEntity<Void> block(@PathVariable UUID userId) {
    socialService.blockUser(userId);
    return ResponseEntity.ok().build();
  }
}
