"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg-home, #ffffff)' }}>
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-4 italic uppercase" style={{ color: 'var(--color-text-primary, #000000)' }}>
          {isRTL ? 'حدث خطأ ما' : 'Something Went Wrong'}
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary, #666666)' }}>
          {isRTL ? 'نأسف، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.' : 'Sorry, an unexpected error occurred. Please try again or return to the home page.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:opacity-80"
            style={{ background: 'var(--color-bg-primary, #000000)', color: 'var(--color-text-on-primary, #ffffff)' }}
          >
            <RefreshCw className="w-4 h-4" />
            {isRTL ? 'حاول مرة أخرى' : 'Try Again'}
          </button>
          <Link
            href="."
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:opacity-80 border-2"
            style={{ borderColor: 'var(--color-text-primary, #000000)', color: 'var(--color-text-primary, #000000)' }}
          >
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-[10px] font-mono opacity-30">{isRTL ? 'رمز الخطأ' : 'Error ID'}: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
