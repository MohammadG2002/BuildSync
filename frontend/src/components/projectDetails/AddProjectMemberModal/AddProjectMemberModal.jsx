import React, { useState } from "react";
import { Users, Lock, EyeOff } from "lucide-react";
import * as projectService from "../../../services/projectService";
import styles from "./AddProjectMemberModal.module.css";

const AddProjectMemberModal = ({
  workspaceMembers = [],
  project,
  workspaceId,
  projectId,
  canEdit = false,
  onCancel,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const projectMemberIds = new Set(
    (project?.members || []).map(
      (m) => m?.user?._id || m?.user || m?.id || m?._id
    )
  );
  const ownerId = project?.owner?._id || project?.owner;

  const isProjectMember = (member) => projectMemberIds.has(member.id);
  const isOwner = (member) => ownerId && member.id === ownerId;
  const isToggleLocked = (member) => !canEdit || isOwner(member);

  const filteredMembers = workspaceMembers.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q)
    );
  });

  const handleToggle = async (member) => {
    if (isToggleLocked(member) || togglingId) return;
    try {
      setTogglingId(member.id);
      if (isProjectMember(member)) {
        await projectService.removeProjectMember(
          workspaceId,
          projectId,
          member.id
        );
      } else {
        await projectService.addProjectMember(
          workspaceId,
          projectId,
          member.id
        );
      }
      await onRefresh?.();
    } catch (e) {
      console.error("Failed to toggle project member:", e);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className={styles.addMemberModal}>
      <p className={styles.addMemberDescription}>
        Browse workspace members and click to add/remove them from this project.
      </p>

      {workspaceMembers.length === 0 ? (
        <div className={styles.noMembersAvailable}>
          <Users className={styles.noMembersIcon} />
          <p>No workspace members found</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search members by name or email"
            className={styles.memberSearchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.memberSelectList}>
            {filteredMembers.map((member) => {
              const active = isProjectMember(member);
              const locked = isToggleLocked(member);
              return (
                <div
                  key={member.id}
                  className={`${styles.memberSelectItem} ${
                    active ? styles.memberSelectItemActive : ""
                  } ${locked ? styles.memberSelectItemDisabled : ""}`}
                  onClick={() => handleToggle(member)}
                  title={
                    locked
                      ? canEdit
                        ? "Cannot remove project owner"
                        : "View-only"
                      : active
                      ? "Click to remove from project"
                      : "Click to add to project"
                  }
                >
                  <div className={styles.memberSelectInfo}>
                    <span className={styles.memberSelectName}>
                      {member.name}
                    </span>
                    <span className={styles.memberSelectEmail}>
                      {member.email}
                    </span>
                  </div>
                  {isOwner(member) ? (
                    <span
                      className={`${styles.memberSelectRole} ${styles.memberLockedTag}`}
                    >
                      <Lock style={{ width: 14, height: 14, marginRight: 6 }} />
                      Owner
                    </span>
                  ) : active ? (
                    <span className={styles.memberSelectRole}>Member</span>
                  ) : canEdit ? (
                    <span className={styles.memberSelectRole}>Add</span>
                  ) : (
                    <span
                      className={`${styles.memberSelectRole} ${styles.memberLockedTag}`}
                    >
                      <EyeOff
                        style={{ width: 14, height: 14, marginRight: 6 }}
                      />
                      View Only
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AddProjectMemberModal;
