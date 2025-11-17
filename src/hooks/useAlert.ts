"use client";
import { useState, useCallback } from "react";

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success" | "error";
}

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  type: "success" | "error" | "warning" | "info";
}

export const useAlert = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
  });

  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Đồng ý",
    type: "success",
  });

  const showConfirm = useCallback(
    (
      message: string,
      title: string = "Xác nhận",
      onConfirm?: () => void,
      type: "danger" | "warning" | "info" = "warning",
      confirmText?: string,
      cancelText?: string
    ) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        onConfirm,
        confirmText,
        cancelText,
        type,
      });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback(
    (
      message: string,
      title: string = "Thành công",
      onConfirm?: () => void,
      confirmText: string = "Đồng ý"
    ) => {
      setAlertState({
        isOpen: true,
        title,
        message,
        onConfirm,
        confirmText,
        type: "success",
      });
    },
    []
  );

  const showError = useCallback(
    (
      message: string,
      title: string = "Lỗi",
      onConfirm?: () => void,
      confirmText: string = "Đồng ý"
    ) => {
      setAlertState({
        isOpen: true,
        title,
        message,
        onConfirm,
        confirmText,
        type: "error",
      });
    },
    []
  );

  const showWarning = useCallback(
    (
      message: string,
      title: string = "Cảnh báo",
      onConfirm?: () => void,
      confirmText: string = "Đồng ý"
    ) => {
      setAlertState({
        isOpen: true,
        title,
        message,
        onConfirm,
        confirmText,
        type: "warning",
      });
    },
    []
  );

  const showInfo = useCallback(
    (
      message: string,
      title: string = "Thông tin",
      onConfirm?: () => void,
      confirmText: string = "Đồng ý"
    ) => {
      setAlertState({
        isOpen: true,
        title,
        message,
        onConfirm,
        confirmText,
        type: "info",
      });
    },
    []
  );

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmState,
    showConfirm,
    closeConfirm,
    alertState,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeAlert,
  };
};

