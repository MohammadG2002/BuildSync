import { Users } from "lucide-react";
import Button from "../common/Button";
import styles from "../../pages/projects/ProjectDetails.module.css";

const AddProjectMemberModal = ({
  workspaceMembers,
  projectMembers,
  selectedMemberId,
  onMemberSelect,
  onCancel,
  onConfirm,
  loading,
}) => {
  // Filter out members who are already in the project
  const projectMemberIds = new Set(
    projectMembers?.map((m) => m.id || m.userId) || []
  );
  const availableMembers = workspaceMembers.filter(
    (member) => !projectMemberIds.has(member.id)
  );

  return (
    <div className={styles.addMemberModal}>
      <p className={styles.addMemberDescription}>
        Select a workspace member to add to this project
      </p>

      {availableMembers.length === 0 ? (
        <div className={styles.noMembersAvailable}>
          <Users className={styles.noMembersIcon} />
          <p>All workspace members are already in this project</p>
        </div>
      ) : (
        <>
          <div className={styles.memberSelectList}>
            {availableMembers.map((member) => (
              <div
                key={member.id}
                className={`${styles.memberSelectItem} ${
                  selectedMemberId === member.id
                    ? styles.memberSelectItemActive
                    : ""
                }`}
                onClick={() => onMemberSelect(member.id)}
              >
                <div className={styles.memberSelectInfo}>
                  <span className={styles.memberSelectName}>{member.name}</span>
                  <span className={styles.memberSelectEmail}>
                    {member.email}
                  </span>
                </div>
                <span className={styles.memberSelectRole}>{member.role}</span>
              </div>
            ))}
          </div>

          <div className={styles.addMemberActions}>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              loading={loading}
              disabled={!selectedMemberId}
            >
              Add Member
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddProjectMemberModal;
