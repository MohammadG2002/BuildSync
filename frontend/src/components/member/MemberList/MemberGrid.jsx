import MemberCard from "../MemberCard/MemberCard/MemberCard";
import styles from "./MemberList.module.css";

const MemberGrid = ({
  members,
  currentUserId,
  currentUserRole,
  onChangeRole,
  onRemove,
  onTransferOwnership,
}) => {
  return (
    <div className={styles.memberGrid}>
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onChangeRole={onChangeRole}
          onRemove={onRemove}
          onTransferOwnership={onTransferOwnership}
        />
      ))}
    </div>
  );
};

export default MemberGrid;
