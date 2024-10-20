import React from "react";

import { motion } from "framer-motion";

const ShotGlass = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M30 20H70L60 80H40L30 20Z"
      stroke="#4F46E5"
      strokeWidth="4"
      fill="transparent"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.rect
      x="35"
      y="75"
      width="30"
      height="0"
      fill="#4F46E5"
      animate={{ height: 20, y: 55 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
);

const ShotBetsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <ShotGlass />
    </div>
  );
};

export default ShotBetsLoading;
