import { useState, useEffect } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import { activityConfig } from "./activity/activityConfig";
import { generateMockActivities } from "./activity/mockActivityData";
import { filterActivities } from "./activity/utils";
import ActivityFilters from "./activity/ActivityFilters";
import ActivityItem from "./activity/ActivityItem";
import ActivitySkeleton from "./activity/ActivitySkeleton";
import ActivityEmptyState from "./activity/ActivityEmptyState";

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

        // Mock data for demonstration
        const mockActivities = generateMockActivities(activityConfig);

        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
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
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <ActivityFilters filter={filter} onFilterChange={setFilter} />
      )}

      {/* Activity List */}
      <div className="space-y-4">
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
          className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Load More Activities
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
