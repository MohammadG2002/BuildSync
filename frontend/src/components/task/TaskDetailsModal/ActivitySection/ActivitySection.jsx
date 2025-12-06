import { useMemo } from "react";
import styles from "./ActivitySection.module.css";
import { getRelativeTime } from "../../../../utils/helpers";
import UserAvatar from "../../../common/UserAvatar/UserAvatar/UserAvatar";

const formatItem = (it) => {
  const actorName = it?.actor?.name || it?.actor?.email || "Someone";
  switch (it?.type) {
    case "created":
      return `${actorName} created this task`;
    case "title_changed": {
      const from = it?.meta?.from ?? "";
      return `${actorName} changed the task name`;
    }
    case "status_changed":
      return `${actorName} changed the status to ${it?.meta?.to}`;
    case "priority_changed":
      return `${actorName} changed the priority to ${it?.meta?.to}`;
    case "due_date_changed":
      return `${actorName} updated the due date`;
    case "assignees_changed": {
      const added = Array.isArray(it?.meta?.added) ? it.meta.added.length : 0;
      const removed = Array.isArray(it?.meta?.removed)
        ? it.meta.removed.length
        : 0;
      const parts = [];
      if (added) parts.push(`assigned ${added}`);
      if (removed) parts.push(`removed ${removed}`);
      return `${actorName} ${parts.join(" and ") || "updated assignees"}`;
    }
    default:
      return `${actorName} did an update`;
  }
};

const ActivitySection = ({ items = [], loading = false }) => {
  const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  return (
    <div className={styles.activitySection}>
      {loading ? (
        <p className={styles.metadataTextMuted}>Loading activity…</p>
      ) : list.length === 0 ? (
        <p className={styles.metadataTextMuted}>No activity yet</p>
      ) : (
        <ul className={styles.activityList}>
          {list.map((it, idx) => {
            const actor = it?.actor || {};
            const name = actor.name || actor.email || "User";
            return (
              <li key={it._id || idx} className={styles.activityItem}>
                <UserAvatar
                  name={name}
                  avatar={actor.avatar}
                  className={styles.userAvatar}
                />
                <div className={styles.activityContent}>
                  <div className={styles.activityMessage}>{formatItem(it)}</div>
                  <div className={styles.activityTime}>
                    {getRelativeTime(it?.createdAt)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivitySection;
