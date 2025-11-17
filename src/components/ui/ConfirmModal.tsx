"use client";
import React from "react";
import { Modal } from "./modal";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-warning-500 hover:bg-warning-600";
      case "info":
        return "bg-blue-light-500 hover:bg-blue-light-600";
      default:
        return "bg-warning-500 hover:bg-warning-600";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] p-6"
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${
            type === "danger" 
              ? "bg-red-100 dark:bg-red-900/20" 
              : type === "warning"
              ? "bg-warning-100 dark:bg-warning-900/20"
              : "bg-blue-light-100 dark:bg-blue-light-900/20"
          }`}>
            <AlertTriangle className={`w-8 h-8 ${
              type === "danger"
                ? "text-red-600 dark:text-red-400"
                : type === "warning"
                ? "text-warning-600 dark:text-warning-400"
                : "text-blue-light-600 dark:text-blue-light-400"
            }`} />
          </div>
        </div>
        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h4>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${getButtonColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

