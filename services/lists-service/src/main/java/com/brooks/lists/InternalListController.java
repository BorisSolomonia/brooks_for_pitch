package com.brooks.lists;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/lists")
public class InternalListController {
  private final ListService listService;

  public InternalListController(ListService listService) {
    this.listService = listService;
  }

  @PostMapping("/membership")
  public ResponseEntity<ListMembershipResponse> membership(
      @RequestBody ListMembershipRequest request
  ) {
    return ResponseEntity.ok(listService.membership(request));
  }
}
