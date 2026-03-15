package com.brooks.social;

public record FollowRecordResponse(
    String followId,
    String userId,
    String status
) {}
