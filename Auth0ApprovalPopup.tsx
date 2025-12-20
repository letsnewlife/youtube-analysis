import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useAuth0 } from "@auth0/auth0-react";

export function Auth0ApprovalPopup() {
  const { error, isLoading, logout } = useAuth0();
  const shownRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!error) return;
    if (shownRef.current) return;

    // @auth0/auth0-react 에러는 보통 OAuthError 형태로 error/error_description을 가짐
    const e: any = error;
    const code = e.error; // 예: "access_denied"
    const desc = e.error_description ?? error.message;

    // 승인대기(deny)면 보통 access_denied로 들어오고 description에 메시지가 들어옴
    if (code === "access_denied") {
      shownRef.current = true;

      Swal.fire({
        icon: "info",
        title: "승인 대기중",
        text: desc || "관리자 승인 후 로그인 가능합니다.",
        confirmButtonText: "확인",
      }).then(() => {
        // deny 후에도 Auth0 세션이 남아 재시도 시 꼬일 수 있어 로그아웃 권장
        // (특히 다른 계정으로 다시 로그인하게 하려면 더 중요)
        logout({
          logoutParams: { returnTo: window.location.origin },
        });
      });
    }
  }, [error, isLoading, logout]);

  return null;
}