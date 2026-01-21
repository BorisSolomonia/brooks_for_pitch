package com.brooks.social;

import com.brooks.security.SecurityContextUtil;
import java.time.Instant;
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

  @Transactional
  public FriendRequestResponse requestFriend(UUID targetUserId) {
    UUID actorId = requireActor();
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
