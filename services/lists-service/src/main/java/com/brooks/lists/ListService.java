package com.brooks.lists;

import com.brooks.security.SecurityContextUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ListService {
  private final ListRepository listRepository;
  private final ListMemberRepository listMemberRepository;

  public ListService(ListRepository listRepository, ListMemberRepository listMemberRepository) {
    this.listRepository = listRepository;
    this.listMemberRepository = listMemberRepository;
  }

  @Transactional
  public ListResponse createList(ListCreateRequest request) {
    UUID ownerId = requireActor();
    ListEntity list = new ListEntity();
    list.setOwnerId(ownerId);
    list.setListType(request.listType());
    list.setName(request.name());
    ListEntity saved = listRepository.save(list);
    return new ListResponse(saved.getId().toString(), saved.getName(), saved.getListType().name());
  }

  @Transactional
  public void addMembers(UUID listId, ListMembersRequest request) {
    UUID ownerId = requireActor();
    ListEntity list = listRepository.findById(listId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found"));
    if (!list.getOwnerId().equals(ownerId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not list owner");
    }
    for (String memberId : request.memberIds()) {
      UUID memberUuid = UUID.fromString(memberId);
      if (!listMemberRepository.existsByListIdAndMemberUserId(listId, memberUuid)) {
        ListMemberEntity member = new ListMemberEntity();
        member.setListId(listId);
        member.setMemberUserId(memberUuid);
        listMemberRepository.save(member);
      }
    }
  }

  public ListMembershipResponse membership(ListMembershipRequest request) {
    UUID userId = UUID.fromString(request.userId());
    if (request.listIds() == null || request.listIds().isEmpty()) {
      return new ListMembershipResponse(false, List.of());
    }
    List<String> matched = new ArrayList<>();
    for (String listId : request.listIds()) {
      UUID listUuid = UUID.fromString(listId);
      if (listMemberRepository.existsByListIdAndMemberUserId(listUuid, userId)) {
        matched.add(listId);
      }
    }
    return new ListMembershipResponse(!matched.isEmpty(), matched);
  }

  private UUID requireActor() {
    UUID actorId = SecurityContextUtil.currentUserId();
    if (actorId == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
    }
    return actorId;
  }
}
