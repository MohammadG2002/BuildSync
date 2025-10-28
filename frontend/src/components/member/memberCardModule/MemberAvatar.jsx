import { getInitials, generateColor } from "../../../utils/helpers";

const MemberAvatar = ({ name }) => {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
      style={{ backgroundColor: generateColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
};

export default MemberAvatar;
