import React, { useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export function ApprovalModal({
  open,
  title = "승인 대기중",
  message,
  onClose,
}: Props) {
  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="a0-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // 바깥 클릭으로 닫기
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="a0-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="a0-header">
          <div className="a0-title">{title}</div>
          <button className="a0-x" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="a0-body">
          <p className="a0-message">{message}</p>
        </div>

        <div className="a0-footer">
          <button className="a0-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
