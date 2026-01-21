package com.brooks.app.lists;

import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lists")
public class ListController {
  private final ListService listService;

  public ListController(ListService listService) {
    this.listService = listService;
  }

  @PostMapping
  public ResponseEntity<ListResponse> create(@Valid @RequestBody ListCreateRequest request) {
    return ResponseEntity.status(201).body(listService.createList(request));
  }

  @PostMapping("/{id}/members")
  public ResponseEntity<Void> addMembers(
      @PathVariable UUID id,
      @Valid @RequestBody ListMembersRequest request
  ) {
    listService.addMembers(id, request);
    return ResponseEntity.ok().build();
  }
}
