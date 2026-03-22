package com.brooks.notifications;

import com.brooks.security.SecurityContextUtil;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class NotificationController {
  private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping("/notifications")
  public ResponseEntity<List<NotificationEntity>> getNotifications() {
    UUID userId = requireUser();
    return ResponseEntity.ok(notificationService.getForUser(userId));
  }

  @GetMapping("/notifications/unread-count")
  public ResponseEntity<Map<String, Long>> getUnreadCount() {
    UUID userId = requireUser();
    long count = notificationService.getUnreadCount(userId);
    return ResponseEntity.ok(Map.of("count", count));
  }

  @PostMapping("/notifications/{id}/read")
  public ResponseEntity<Void> markRead(@PathVariable UUID id) {
    UUID userId = requireUser();
    notificationService.markRead(userId, id);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/internal/notifications")
  public ResponseEntity<NotificationEntity> createInternal(@RequestBody CreateNotificationRequest request) {
    log.info("Internal notification create: userId={}, type={}, referenceId={}",
        request.userId(), request.type(), request.referenceId());
    NotificationEntity entity = notificationService.create(
        request.userId(),
        request.type(),
        request.referenceId(),
        request.title(),
        request.body()
    );
    return ResponseEntity.status(201).body(entity);
  }

  private UUID requireUser() {
    UUID userId = SecurityContextUtil.currentUserId();
    if (userId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return userId;
  }
}
