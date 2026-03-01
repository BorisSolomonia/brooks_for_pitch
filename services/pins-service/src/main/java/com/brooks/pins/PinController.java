package com.brooks.pins;

import jakarta.validation.Valid;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  private static final Logger log = LoggerFactory.getLogger(PinController.class);
  private final PinServiceRefactored pinService;

  public PinController(PinServiceRefactored pinService) {
    this.pinService = pinService;
  }

  @PostMapping
  public ResponseEntity<PinResponse> create(@Valid @RequestBody PinCreateRequest request) {
    log.info(
        "create pin request: audienceType={}, revealType={}, mapPrecision={}, futureSelf={}, notifyRadiusM={}, textLength={}",
        request.audienceType(),
        request.revealType(),
        request.mapPrecision(),
        request.futureSelf(),
        request.notifyRadiusM(),
        request.text() == null ? 0 : request.text().length()
    );
    return ResponseEntity.status(201).body(pinService.create(request));
  }

  @GetMapping("/map")
  public ResponseEntity<MapPinsResponse> mapPins(@RequestParam String bbox) {
    log.info("map pins request: bbox={}", bbox);
    return ResponseEntity.ok(pinService.mapPins(bbox));
  }

  @GetMapping("/candidates")
  public ResponseEntity<PinCandidatesResponse> candidates(@RequestParam String bucket) {
    log.info("pin candidates request: bucket={}", bucket);
    return ResponseEntity.ok(pinService.candidates(bucket));
  }

  @PostMapping("/{id}/check-reveal")
  public ResponseEntity<RevealCheckResponse> checkReveal(
      @PathVariable UUID id,
      @Valid @RequestBody RevealCheckRequest request
  ) {
    log.info(
        "check reveal request: pinId={}, lat={}, lng={}",
        id,
        request.location().lat(),
        request.location().lng()
    );
    return ResponseEntity.ok(pinService.checkReveal(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    log.info("delete pin request: pinId={}", id);
    pinService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
