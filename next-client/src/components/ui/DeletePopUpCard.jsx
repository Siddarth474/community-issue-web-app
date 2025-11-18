"use client"

import { Loader2Icon, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmCard({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-9999">
      <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 },
      }}
      className="bg-white dark:bg-gray-900 w-[90%] max-w-sm rounded-xl shadow-2xl p-6 text-center relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Trash2 className="text-red-500" size={36} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Delete this issue?
          </h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this issue? This action cannot be undone.
          </p>

          <div className="flex justify-center gap-4 mt-5 w-full">
            <button
              onClick={onCancel}
              className="w-1/2 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 
              cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-1/2 py-2.5 rounded-lg flex justify-center bg-red-500 text-white font-medium 
              cursor-pointer hover:bg-red-600 transition"
            >
              {loading ? <Loader2Icon size={20} className="animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}