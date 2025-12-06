import { useState, useEffect } from "react";
import { useWorkspace } from "../../../../hooks/useWorkspace";
import { activityConfig } from "../../../../utils/common/activity/activityConfig";
import { filterActivities } from "../../../../utils/common/activity/utils";
import ActivityFilters from "../ActivityFilters/ActivityFilters";
import ActivityItem from "../ActivityItem/ActivityItem";
import ActivitySkeleton from "../ActivitySkeleton/ActivitySkeleton";
import ActivityEmptyState from "../ActivityEmptyState/ActivityEmptyState";
import styles from "./ActivityFeed.module.css";

const ActivityFeed = ({
  workspaceId = null,
  projectId = null,
  limit = 20,
  showFilters = true,
}) => {
  const { currentWorkspace } = useWorkspace();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await activityService.getActivities({ workspaceId, projectId, limit });
        // setActivities(response);

        setActivities([]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setActivities([]);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [workspaceId, projectId, limit]);

  const filteredActivities = filterActivities(activities, filter);

  if (loading) {
    return <ActivitySkeleton />;
  }

  return (
    <div className={styles.container}>
      {/* Filters */}
      {showFilters && (
        <ActivityFilters filter={filter} onFilterChange={setFilter} />
      )}

      {/* Activity List */}
      <div className={styles.list}>
        {filteredActivities.length === 0 ? (
          <ActivityEmptyState />
        ) : (
          filteredActivities.map((activity) => {
            const config =
              activityConfig[activity.type] || activityConfig.status_changed;

            return (
              <ActivityItem
                key={activity.id}
                activity={activity}
                config={config}
              />
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length >= limit && (
        <button
          onClick={() => {
            /* TODO: Load more activities */
          }}
          className={styles.loadMore}
        >
          Load More Activities
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
