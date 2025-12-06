import styles from "./MemberJoinDate.module.css";

const MemberJoinDate = ({ joinedDate }) => {
  if (!joinedDate) return null;

  return (
    <div className={styles.joinDate}>
      Joined{" "}
      {new Date(joinedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </div>
  );
};

export default MemberJoinDate;
