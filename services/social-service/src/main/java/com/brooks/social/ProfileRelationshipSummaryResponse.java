package com.brooks.social;

public record ProfileRelationshipSummaryResponse(
    String userId,
    boolean self,
    boolean friend,
    boolean following,
    boolean incomingFriendRequest,
    boolean outgoingFriendRequest,
    long friendCount,
    long followerCount,
    long followingCount
) {}
