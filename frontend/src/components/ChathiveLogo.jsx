import React from "react";

export const ChathiveLogo = ({ className = "w-8 h-8", color = "#38bdf8", strokeWidth = 3 }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Speech bubble with tail */}
      <path
        d="M26 18H74C81.732 18 88 24.268 88 32V60C88 67.732 81.732 74 74 74H44L30 86V74H26C18.268 74 12 67.732 12 60V32C12 24.268 18.268 18 26 18Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 4-point star / sparkle */}
      <path
        d="M50 34C50 42.5 57.5 50 66 50C57.5 50 50 57.5 50 66C50 57.5 42.5 50 34 50C42.5 50 50 42.5 50 34Z"
        fill={color}
      />
    </svg>
  );
};

export default ChathiveLogo;
