const ActivityIcon = ({ type, config }) => {
  const Icon = config.icon;

  return (
    <div
      className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
    >
      <Icon className={`w-5 h-5 ${config.color}`} />
    </div>
  );
};

export default ActivityIcon;
