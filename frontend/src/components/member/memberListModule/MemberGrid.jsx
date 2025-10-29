import MemberCard from "../MemberCard";
import styles from "../memberCardModule/MemberCard.module.css";

const MemberGrid = ({ members, currentUserId, onChangeRole, onRemove }) => {
  return (
    <div className={styles.memberGrid}>
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserId={currentUserId}
          onChangeRole={onChangeRole}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default MemberGrid;
