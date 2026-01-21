package com.brooks.social;

public record RelationshipPreferencesRequest(
    boolean canSeePins,
    boolean canReceiveProximityNotifications
) {}
