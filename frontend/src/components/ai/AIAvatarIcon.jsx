import React from "react";

export default function AIAvatarIcon(props) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="4"
        y="8"
        width="20"
        height="14"
        rx="7"
        fill="#fff"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <circle cx="10" cy="15" r="2" fill="#3b82f6" />
      <circle cx="18" cy="15" r="2" fill="#3b82f6" />
      <rect x="11" y="19" width="6" height="2" rx="1" fill="#3b82f6" />
      <rect x="12.5" y="4" width="3" height="6" rx="1.5" fill="#3b82f6" />
    </svg>
  );
}
