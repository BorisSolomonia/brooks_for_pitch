package com.brooks.auth;

import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
