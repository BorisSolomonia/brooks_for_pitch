package com.brooks.social;

public record FriendRequestRecordResponse(
    String requestId,
    String userId,
    String status
) {}
