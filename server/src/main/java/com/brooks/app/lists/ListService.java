package com.brooks.app.lists;

import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ListService {
  public ListResponse createList(ListCreateRequest request) {
    return new ListResponse(UUID.randomUUID().toString(), request.name(), request.listType().name());
  }

  public void addMembers(UUID listId, ListMembersRequest request) {
  }
}
