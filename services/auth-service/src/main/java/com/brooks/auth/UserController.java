package com.brooks.auth;

import java.util.List;
import java.util.UUID;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
  private final AuthService authService;

  public UserController(AuthService authService) {
    this.authService = authService;
  }

  @GetMapping("/search")
  public ResponseEntity<List<UserSummaryResponse>> search(@RequestParam String q) {
    return ResponseEntity.ok(authService.searchUsers(q));
  }

  @GetMapping
  public ResponseEntity<List<UserSummaryResponse>> byIds(@RequestParam List<UUID> ids) {
    return ResponseEntity.ok(authService.getUserSummaries(ids));
  }

  @GetMapping("/me/profile")
  public ResponseEntity<UserProfileResponse> me() {
    return ResponseEntity.ok(authService.currentProfile());
  }

  @PatchMapping("/me/profile")
  public ResponseEntity<UserProfileResponse> updateMe(@Valid @RequestBody UpdateUserProfileRequest request) {
    return ResponseEntity.ok(authService.updateCurrentProfile(request));
  }

  @GetMapping("/{userId}/profile")
  public ResponseEntity<UserProfileResponse> byId(@PathVariable UUID userId) {
    return ResponseEntity.ok(authService.profileById(userId));
  }

  @GetMapping("/handle/{handle}/profile")
  public ResponseEntity<UserProfileResponse> byHandle(@PathVariable String handle) {
    return ResponseEntity.ok(authService.profileByHandle(handle));
  }
}
