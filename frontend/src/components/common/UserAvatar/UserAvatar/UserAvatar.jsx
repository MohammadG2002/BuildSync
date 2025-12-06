import { getInitials, generateColor } from "../../../../utils/helpers";

const UserAvatar = ({ name = "User", avatar, className, title, style }) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={`${name} avatar`}
        className={className}
        title={title || name}
        style={{ borderRadius: 9999, objectFit: "cover", ...style }}
      />
    );
  }
  return (
    <div
      className={className}
      title={title || name}
      style={{ backgroundColor: generateColor(name), ...style }}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
