import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-slide-up bg-[#0F1729]/95 border-[#1E2A44]"
          style={{
            borderColor: toast.type === 'success' ? 'rgba(52, 211, 153, 0.4)' : toast.type === 'danger' ? 'rgba(248, 113, 113, 0.4)' : 'rgba(96, 165, 250, 0.4)'
          }}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </span>
            )}
            {toast.type === 'danger' && (
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle size={18} />
              </span>
            )}
            {toast.type === 'info' && (
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Info size={18} />
              </span>
            )}

            <div>
              <div className="font-semibold text-sm text-white">{toast.title}</div>
              {toast.message && <div className="text-xs text-[#A3B1C6] mt-0.5">{toast.message}</div>}
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8696AE] hover:text-white p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
