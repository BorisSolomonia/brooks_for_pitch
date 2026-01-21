package com.brooks.app.media;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media")
public class MediaController {
  private final MediaService mediaService;

  public MediaController(MediaService mediaService) {
    this.mediaService = mediaService;
  }

  @PostMapping("/upload-url")
  public ResponseEntity<MediaUploadResponse> uploadUrl(@Valid @RequestBody MediaUploadRequest request) {
    return ResponseEntity.ok(mediaService.createUploadUrl(request));
  }
}
