
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AlertCircle } from "lucide-react";

export function Auth0ApprovalPopup() {
  const { error, isLoading, logout } = useAuth0();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!error) return;

    // Auth0 에러 객체 확인
    const e: any = error;
    const code = e.error || (error as any).error_code;

    // access_denied (승인 전 상태) 핸들링
    if (code === "access_denied" || error.message.includes("access_denied") || error.message.includes("승인 대기")) {
      setShowModal(true);
    }
  }, [error, isLoading]);

  const handleConfirm = () => {
    setShowModal(false);
    // 승인 거부 상태에서 세션을 초기화하기 위해 로그아웃 실행
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6 transform transition-all scale-100">
        <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            승인 대기중
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            관리자 승인 후 로그인 가능합니다.<br />
            잠시만 기다려주세요.
          </p>
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg shadow-red-200 dark:shadow-none"
        >
          확인
        </button>
      </div>
    </div>
  );
}
