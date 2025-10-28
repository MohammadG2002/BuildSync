import Card from "../../../components/common/Card";

const WorkspaceInfoCard = ({ workspaceId, createdDate, memberCount }) => {
  return (
    <Card title="Workspace Information">
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Workspace ID
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unique identifier for this workspace
            </p>
          </div>
          <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
            {workspaceId}
          </code>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Created Date
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              When this workspace was created
            </p>
          </div>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {createdDate
              ? new Date(createdDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>

        <div className="flex justify-between items-center py-3">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Members
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Number of members in this workspace
            </p>
          </div>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {memberCount || 0}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceInfoCard;
