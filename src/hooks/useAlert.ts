"use client";
import { useState, useCallback } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showAlert = useCallback(
    (
      type: AlertType,
      title: string,
      message: string,
      onConfirm?: () => void,
      confirmText?: string
    ) => {
      setAlertState({
        isOpen: true,
        type,
        title,
        message,
        onConfirm,
        confirmText,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title: string = "Thành công!", onConfirm?: () => void) => {
      showAlert("success", title, message, onConfirm);
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, title: string = "Lỗi!", onConfirm?: () => void) => {
      showAlert("error", title, message, onConfirm);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string, title: string = "Cảnh báo!", onConfirm?: () => void) => {
      showAlert("warning", title, message, onConfirm);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string, title: string = "Thông tin", onConfirm?: () => void) => {
      showAlert("info", title, message, onConfirm);
    },
    [showAlert]
  );

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

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alertState,
    confirmState,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    closeAlert,
    closeConfirm,
  };
};

