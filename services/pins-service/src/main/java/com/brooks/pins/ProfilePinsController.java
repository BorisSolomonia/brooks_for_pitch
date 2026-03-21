package com.brooks.pins;

import com.brooks.pins.service.ProfilePinsService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pins/profiles")
public class ProfilePinsController {
  private final ProfilePinsService profilePinsService;

  public ProfilePinsController(ProfilePinsService profilePinsService) {
    this.profilePinsService = profilePinsService;
  }

  @GetMapping("/{userId}/featured")
  public ResponseEntity<ProfileMemoriesResponse> featured(@PathVariable UUID userId) {
    return ResponseEntity.ok(profilePinsService.featured(userId));
  }

  @GetMapping("/{userId}/recent")
  public ResponseEntity<ProfileMemoriesResponse> recent(@PathVariable UUID userId) {
    return ResponseEntity.ok(profilePinsService.recent(userId));
  }

  @GetMapping("/{userId}/map-summary")
  public ResponseEntity<ProfileMapSummaryResponse> mapSummary(@PathVariable UUID userId) {
    return ResponseEntity.ok(profilePinsService.mapSummary(userId));
  }
}
