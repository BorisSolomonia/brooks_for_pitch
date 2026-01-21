package com.brooks.app.pins;

import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pins")
public class PinController {
  private final PinService pinService;

  public PinController(PinService pinService) {
    this.pinService = pinService;
  }

  @PostMapping
  public ResponseEntity<PinResponse> create(@Valid @RequestBody PinCreateRequest request) {
    return ResponseEntity.status(201).body(pinService.create(request));
  }

  @GetMapping("/map")
  public ResponseEntity<MapPinsResponse> mapPins(@RequestParam String bbox) {
    return ResponseEntity.ok(pinService.mapPins(bbox));
  }

  @GetMapping("/candidates")
  public ResponseEntity<PinCandidatesResponse> candidates(@RequestParam String bucket) {
    return ResponseEntity.ok(pinService.candidates(bucket));
  }

  @PostMapping("/{id}/check-reveal")
  public ResponseEntity<RevealCheckResponse> checkReveal(
      @PathVariable UUID id,
      @Valid @RequestBody RevealCheckRequest request
  ) {
    return ResponseEntity.ok(pinService.checkReveal(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    pinService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
