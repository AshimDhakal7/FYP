import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logo({ clickable = false, size = "normal" }) {
  const navigate = useNavigate();

  const scale =
    size === "small"
      ? "w-3 h-3 text-xl"
      : size === "large"
      ? "w-6 h-6 text-3xl"
      : "w-4 h-4 text-2xl";

  return (
    <div
      onClick={() => clickable && navigate("/")}
      className={`flex items-center gap-2 ${
        clickable ? "cursor-pointer group" : ""
      }`}
    >
      {/* Cricket Ball */}
      <div
        className={`relative ${scale.split(" ")[0]} ${scale.split(" ")[1]} rounded-full bg-red-600 shadow-sm overflow-hidden ${
          clickable ? "group-hover:scale-110 transition" : ""
        }`}
      >
        {/* seam line */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-white opacity-90"></div>

        {/* stitches */}
        <div className="absolute left-1/2 top-[2px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
        <div className="absolute left-1/2 top-[6px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
        <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
      </div>

      {/* Brand Text */}
      <h1 className={`font-extrabold tracking-tight ${scale.split(" ")[2]}`}>
        <span className="text-green-700">Cric</span>
        <span className="text-orange-500">Book</span>
      </h1>
    </div>
  );
}
