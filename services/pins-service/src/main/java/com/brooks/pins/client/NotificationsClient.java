package com.brooks.pins.client;

import java.util.UUID;

public interface NotificationsClient {
  void sendRevealNotification(UUID recipientId, UUID pinId, UUID ownerId);
}
