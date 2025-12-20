
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AlertCircle } from "lucide-react";

export function Auth0ApprovalPopup() {
  const { error, isLoading } = useAuth0();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!error) {
      setShowModal(false);
      return;
    }

    // Auth0 에러 객체 확인
    const e: any = error;
    const code = e.error || (error as any).error_code;
    const message = error.message || "";

    // access_denied (승인 전 상태 또는 차단됨) 핸들링
    if (code === "access_denied" || message.includes("access_denied") || message.includes("승인 대기")) {
      setShowModal(true);
    }
  }, [error, isLoading]);

  const handleConfirm = () => {
    // 세션을 유지하면서 계정 상태를 재확인하기 위해 새로고침을 실행합니다.
    // 만약 여전히 차단 상태라면 App.tsx의 ignoreCache: true 로직에 의해 다시 팝업이 뜹니다.
    window.location.reload();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6 transform transition-all scale-100">
        <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            승인 대기중 / 차단됨
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            관리자 승인 후 로그인 가능합니다.<br />
            또는 계정 권한을 확인해주세요.
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
