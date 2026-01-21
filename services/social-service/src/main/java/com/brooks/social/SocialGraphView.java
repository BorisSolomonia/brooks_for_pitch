package com.brooks.social;

public record SocialGraphView(
    boolean blocked,
    boolean friend,
    boolean follower,
    boolean canSeePins,
    boolean canReceiveNotifications
) {}
