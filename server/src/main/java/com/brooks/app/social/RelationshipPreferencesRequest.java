package com.brooks.app.social;

public record RelationshipPreferencesRequest(
    boolean canSeePins,
    boolean canReceiveProximityNotifications
) {}
