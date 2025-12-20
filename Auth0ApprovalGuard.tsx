import React, { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ApprovalModal } from "./ApprovalModal";
import "./approval-modal.css";

export function Auth0ApprovalGuard() {
  const { error, isLoading, logout } = useAuth0();
  const [open, setOpen] = useState(false);

  const parsed = useMemo(() => {
    const e: any = error;
    return {
      code: e?.error, // 보통 "access_denied"
      description: e?.error_description ?? error?.message ?? "",
    };
  }, [error]);

  useEffect(() => {
    if (isLoading) return;
    if (!error) return;

    // Post Login deny()는 보통 access_denied 로 내려옴
    if (parsed.code === "access_denied") {
      setOpen(true);
    }
  }, [error, isLoading, parsed.code]);

  const close = () => {
    setOpen(false);

    // deny 상태에서 Auth0 세션이 남아있으면 재시도 시 꼬일 수 있어 정리 권장
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <ApprovalModal
      open={open}
      title="승인 대기중"
      message={parsed.description || "관리자 승인 후 로그인 가능합니다."}
      onClose={close}
    />
  );
}
