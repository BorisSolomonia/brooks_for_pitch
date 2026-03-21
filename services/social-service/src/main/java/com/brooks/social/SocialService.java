package com.brooks.social;

import com.brooks.security.SecurityContextUtil;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SocialService {
  private final FriendshipRepository friendshipRepository;
  private final FollowRepository followRepository;
  private final RelationshipPreferenceRepository relationshipPreferenceRepository;
  private final BlockRepository blockRepository;

  public SocialService(
      FriendshipRepository friendshipRepository,
      FollowRepository followRepository,
      RelationshipPreferenceRepository relationshipPreferenceRepository,
      BlockRepository blockRepository
  ) {
    this.friendshipRepository = friendshipRepository;
    this.followRepository = followRepository;
    this.relationshipPreferenceRepository = relationshipPreferenceRepository;
    this.blockRepository = blockRepository;
  }

  @Transactional
  public FollowResponse follow(UUID targetUserId) {
    UUID actorId = requireActor();
    return followRepository.findByFollowerIdAndFolloweeId(actorId, targetUserId)
        .map(existing -> new FollowResponse(existing.getId().toString(), existing.getStatus().name()))
        .orElseGet(() -> {
          FollowEntity follow = new FollowEntity();
          follow.setFollowerId(actorId);
          follow.setFolloweeId(targetUserId);
          follow.setStatus(FollowStatus.ACTIVE);
          FollowEntity saved = followRepository.save(follow);
          return new FollowResponse(saved.getId().toString(), saved.getStatus().name());
        });
  }

  @Transactional(readOnly = true)
  public List<FriendshipRecordResponse> friends() {
    UUID actorId = requireActor();
    return friendshipRepository.findByUserIdAndStatusOrderByAcceptedAtDesc(actorId, FriendshipStatus.ACCEPTED).stream()
        .map(friendship -> new FriendshipRecordResponse(
            friendship.getId().toString(),
            friendship.getFriendId().toString(),
            friendship.getStatus().name()
        ))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FriendRequestRecordResponse> incomingFriendRequests() {
    UUID actorId = requireActor();
    return friendshipRepository.findByFriendIdAndStatusOrderByRequestedAtDesc(actorId, FriendshipStatus.PENDING).stream()
        .map(request -> new FriendRequestRecordResponse(
            request.getId().toString(),
            request.getUserId().toString(),
            request.getStatus().name()
        ))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FriendRequestRecordResponse> sentFriendRequests() {
    UUID actorId = requireActor();
    return friendshipRepository.findByUserIdAndStatusOrderByRequestedAtDesc(actorId, FriendshipStatus.PENDING).stream()
        .map(request -> new FriendRequestRecordResponse(
            request.getId().toString(),
            request.getFriendId().toString(),
            request.getStatus().name()
        ))
        .toList();
  }

  @Transactional
  public FriendRequestResponse requestFriend(UUID targetUserId) {
    UUID actorId = requireActor();
    if (actorId.equals(targetUserId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot friend yourself");
    }
    if (friendshipRepository.findByUserIdAndFriendId(actorId, targetUserId).isPresent()) {
      FriendshipEntity existing = friendshipRepository.findByUserIdAndFriendId(actorId, targetUserId).orElseThrow();
      return new FriendRequestResponse(existing.getId().toString(), existing.getStatus().name());
    }
    FriendshipEntity request = new FriendshipEntity();
    request.setUserId(actorId);
    request.setFriendId(targetUserId);
    request.setStatus(FriendshipStatus.PENDING);
    request.setRequestedAt(Instant.now());
    FriendshipEntity saved = friendshipRepository.save(request);
    return new FriendRequestResponse(saved.getId().toString(), saved.getStatus().name());
  }

  @Transactional
  public FriendshipResponse acceptFriend(UUID requestId) {
    UUID actorId = requireActor();
    FriendshipEntity request = friendshipRepository.findById(requestId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend request not found"));
    if (!actorId.equals(request.getFriendId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to accept");
    }
    request.setStatus(FriendshipStatus.ACCEPTED);
    request.setAcceptedAt(Instant.now());
    friendshipRepository.save(request);

    friendshipRepository.findByUserIdAndFriendId(request.getFriendId(), request.getUserId())
        .orElseGet(() -> {
          FriendshipEntity reciprocal = new FriendshipEntity();
          reciprocal.setUserId(request.getFriendId());
          reciprocal.setFriendId(request.getUserId());
          reciprocal.setStatus(FriendshipStatus.ACCEPTED);
          reciprocal.setRequestedAt(Instant.now());
          reciprocal.setAcceptedAt(request.getAcceptedAt());
          return friendshipRepository.save(reciprocal);
        });

    return new FriendshipResponse(request.getId().toString(), request.getStatus().name());
  }

  @Transactional
  public void declineFriend(UUID requestId) {
    UUID actorId = requireActor();
    FriendshipEntity request = friendshipRepository.findById(requestId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend request not found"));
    if (!actorId.equals(request.getFriendId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to decline");
    }
    friendshipRepository.delete(request);
  }

  @Transactional
  public void removeFriend(UUID userId) {
    UUID actorId = requireActor();
    friendshipRepository.findByUserIdAndFriendId(actorId, userId).ifPresent(friendshipRepository::delete);
    friendshipRepository.findByUserIdAndFriendId(userId, actorId).ifPresent(friendshipRepository::delete);
  }

  @Transactional(readOnly = true)
  public List<FollowRecordResponse> following() {
    UUID actorId = requireActor();
    return followRepository.findByFollowerIdAndStatusOrderByIdDesc(actorId, FollowStatus.ACTIVE).stream()
        .map(follow -> new FollowRecordResponse(
            follow.getId().toString(),
            follow.getFolloweeId().toString(),
            follow.getStatus().name()
        ))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FollowRecordResponse> followers() {
    UUID actorId = requireActor();
    return followRepository.findByFolloweeIdAndStatusOrderByIdDesc(actorId, FollowStatus.ACTIVE).stream()
        .map(follow -> new FollowRecordResponse(
            follow.getId().toString(),
            follow.getFollowerId().toString(),
            follow.getStatus().name()
        ))
        .toList();
  }

  @Transactional(readOnly = true)
  public ProfileRelationshipSummaryResponse profileSummary(UUID userId) {
    UUID actorId = requireActor();
    boolean self = actorId.equals(userId);

    return new ProfileRelationshipSummaryResponse(
        userId.toString(),
        self,
        friendshipRepository.findByUserIdAndFriendIdAndStatus(actorId, userId, FriendshipStatus.ACCEPTED).isPresent(),
        followRepository.findByFollowerIdAndFolloweeId(actorId, userId).isPresent(),
        friendshipRepository.findByUserIdAndFriendIdAndStatus(userId, actorId, FriendshipStatus.PENDING).isPresent(),
        friendshipRepository.findByUserIdAndFriendIdAndStatus(actorId, userId, FriendshipStatus.PENDING).isPresent(),
        friendshipRepository.countByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED),
        followRepository.countByFolloweeIdAndStatus(userId, FollowStatus.ACTIVE),
        followRepository.countByFollowerIdAndStatus(userId, FollowStatus.ACTIVE)
    );
  }

  @Transactional
  public void unfollow(UUID targetUserId) {
    UUID actorId = requireActor();
    followRepository.findByFollowerIdAndFolloweeId(actorId, targetUserId).ifPresent(followRepository::delete);
  }

  @Transactional
  public void updatePreferences(UUID subjectId, RelationshipPreferencesRequest request) {
    UUID viewerId = requireActor();
    RelationshipPreferenceEntity prefs = relationshipPreferenceRepository
        .findByViewerIdAndSubjectId(viewerId, subjectId)
        .orElseGet(RelationshipPreferenceEntity::new);
    prefs.setViewerId(viewerId);
    prefs.setSubjectId(subjectId);
    prefs.setCanSeePins(request.canSeePins());
    prefs.setCanReceiveProximityNotifications(request.canReceiveProximityNotifications());
    relationshipPreferenceRepository.save(prefs);
  }

  @Transactional
  public void blockUser(UUID targetUserId) {
    UUID actorId = requireActor();
    if (!blockRepository.existsByBlockerIdAndBlockedId(actorId, targetUserId)) {
      BlockEntity block = new BlockEntity();
      block.setBlockerId(actorId);
      block.setBlockedId(targetUserId);
      blockRepository.save(block);
    }
  }

  public SocialGraphView graphView(UUID viewerId, UUID subjectId) {
    boolean blocked = blockRepository.existsByBlockerIdAndBlockedId(viewerId, subjectId)
        || blockRepository.existsByBlockerIdAndBlockedId(subjectId, viewerId);

    boolean friend = friendshipRepository
        .findByUserIdAndFriendIdAndStatus(viewerId, subjectId, FriendshipStatus.ACCEPTED)
        .isPresent();

    boolean follower = followRepository.findByFollowerIdAndFolloweeId(viewerId, subjectId).isPresent();

    RelationshipPreferenceEntity prefs = relationshipPreferenceRepository
        .findByViewerIdAndSubjectId(viewerId, subjectId)
        .orElse(null);

    boolean canSeePins = prefs != null && prefs.isCanSeePins();
    boolean canReceiveNotifications = prefs != null && prefs.isCanReceiveProximityNotifications();

    return new SocialGraphView(blocked, friend, follower, canSeePins, canReceiveNotifications);
  }

  private UUID requireActor() {
    UUID actorId = SecurityContextUtil.currentUserId();
    if (actorId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return actorId;
  }
}
