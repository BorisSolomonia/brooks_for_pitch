package com.brooks.notifications;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationService {
  private final NotificationRepository notificationRepository;

  public NotificationService(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public NotificationEntity create(UUID userId, String type, UUID referenceId, String title, String body) {
    NotificationEntity entity = new NotificationEntity();
    entity.setUserId(userId);
    entity.setType(type);
    entity.setReferenceId(referenceId);
    entity.setTitle(title);
    entity.setBody(body);
    entity.setRead(false);
    return notificationRepository.save(entity);
  }

  public List<NotificationEntity> getForUser(UUID userId) {
    return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
  }

  public long getUnreadCount(UUID userId) {
    return notificationRepository.countByUserIdAndReadFalse(userId);
  }

  public void markRead(UUID userId, UUID notificationId) {
    NotificationEntity entity = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
    if (!entity.getUserId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
    }
    entity.setRead(true);
    notificationRepository.save(entity);
  }
}
