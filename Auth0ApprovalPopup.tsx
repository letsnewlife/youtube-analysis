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

    // @auth0/auth0-react 에러 객체 캐스팅
    const e: any = error;
    const code = e.error; 
    const desc = e.error_description || error.message;

    // access_denied (승인 전 상태) 핸들링
    if (code === "access_denied") {
      shownRef.current = true;

      Swal.fire({
        icon: "warning",
        title: "승인 대기중",
        text: "관리자 승인 후 로그인 가능합니다.",
        confirmButtonText: "확인",
        confirmButtonColor: "#EF4444", // Red color to match app theme
      }).then(() => {
        // 승인 거부 상태에서 세션을 초기화하기 위해 로그아웃 실행
        logout({
          logoutParams: { returnTo: window.location.origin },
        });
      });
    }
  }, [error, isLoading, logout]);

  return null;
}
