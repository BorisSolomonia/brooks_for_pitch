package com.brooks.notifications;

import java.util.UUID;

public record CreateNotificationRequest(
    UUID userId,
    String type,
    UUID referenceId,
    String title,
    String body
) {}
