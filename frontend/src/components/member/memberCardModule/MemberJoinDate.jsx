const MemberJoinDate = ({ joinedDate }) => {
  if (!joinedDate) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
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
