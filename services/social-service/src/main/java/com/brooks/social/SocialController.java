package com.brooks.social;

import java.util.UUID;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SocialController {
  private final SocialService socialService;

  public SocialController(SocialService socialService) {
    this.socialService = socialService;
  }

  @GetMapping("/friends")
  public ResponseEntity<List<FriendshipRecordResponse>> friends() {
    return ResponseEntity.ok(socialService.friends());
  }

  @GetMapping("/friends/requests/incoming")
  public ResponseEntity<List<FriendRequestRecordResponse>> incomingFriendRequests() {
    return ResponseEntity.ok(socialService.incomingFriendRequests());
  }

  @GetMapping("/friends/requests/sent")
  public ResponseEntity<List<FriendRequestRecordResponse>> sentFriendRequests() {
    return ResponseEntity.ok(socialService.sentFriendRequests());
  }

  @PostMapping("/follow/{userId}")
  public ResponseEntity<FollowResponse> follow(@PathVariable UUID userId) {
    return ResponseEntity.ok(socialService.follow(userId));
  }

  @GetMapping("/following")
  public ResponseEntity<List<FollowRecordResponse>> following() {
    return ResponseEntity.ok(socialService.following());
  }

  @GetMapping("/followers")
  public ResponseEntity<List<FollowRecordResponse>> followers() {
    return ResponseEntity.ok(socialService.followers());
  }

  @GetMapping("/relationships/{userId}/summary")
  public ResponseEntity<ProfileRelationshipSummaryResponse> profileSummary(@PathVariable UUID userId) {
    return ResponseEntity.ok(socialService.profileSummary(userId));
  }

  @PostMapping("/friends/request/{userId}")
  public ResponseEntity<FriendRequestResponse> requestFriend(@PathVariable UUID userId) {
    return ResponseEntity.ok(socialService.requestFriend(userId));
  }

  @PostMapping("/friends/accept/{requestId}")
  public ResponseEntity<FriendshipResponse> acceptFriend(@PathVariable UUID requestId) {
    return ResponseEntity.ok(socialService.acceptFriend(requestId));
  }

  @PostMapping("/friends/decline/{requestId}")
  public ResponseEntity<Void> declineFriend(@PathVariable UUID requestId) {
    socialService.declineFriend(requestId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/friends/remove/{userId}")
  public ResponseEntity<Void> removeFriend(@PathVariable UUID userId) {
    socialService.removeFriend(userId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/unfollow/{userId}")
  public ResponseEntity<Void> unfollow(@PathVariable UUID userId) {
    socialService.unfollow(userId);
    return ResponseEntity.ok().build();
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

  @GetMapping("/internal/graph/view")
  public ResponseEntity<SocialGraphView> graphView(
      @RequestParam UUID viewerId,
      @RequestParam UUID subjectId
  ) {
    return ResponseEntity.ok(socialService.graphView(viewerId, subjectId));
  }
}
