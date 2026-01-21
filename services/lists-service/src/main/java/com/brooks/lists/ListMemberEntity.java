package com.brooks.lists;

import com.brooks.common.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "list_members")
public class ListMemberEntity extends BaseEntity {
  @Column(nullable = false)
  private UUID listId;

  @Column(nullable = false)
  private UUID memberUserId;

  public UUID getListId() {
    return listId;
  }

  public void setListId(UUID listId) {
    this.listId = listId;
  }

  public UUID getMemberUserId() {
    return memberUserId;
  }

  public void setMemberUserId(UUID memberUserId) {
    this.memberUserId = memberUserId;
  }
}
