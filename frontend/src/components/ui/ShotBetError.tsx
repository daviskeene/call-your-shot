import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const BrokenGlass = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M30 20H70L65 60 M55 80H40L35 40"
      stroke="#EF4444"
      strokeWidth="4"
      strokeLinecap="round"
      fill="transparent"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5 }}
    />
    <motion.path
      d="M65 60L35 40"
      stroke="#EF4444"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    />
  </svg>
);

interface ShotBetsErrorProps {
  onRetry: () => void;
}

const ShotBetsError: React.FC<ShotBetsErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <BrokenGlass />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
          Oops! Something went wrong
        </h2>
        <Button
          onClick={onRetry}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    </div>
  );
};

export default ShotBetsError;
