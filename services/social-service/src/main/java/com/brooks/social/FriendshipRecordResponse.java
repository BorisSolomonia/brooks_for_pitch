package com.brooks.social;

public record FriendshipRecordResponse(
    String friendshipId,
    String userId,
    String status
) {}
