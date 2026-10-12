import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-bold transition-all border animate-in slide-in-from-bottom-2 duration-200 ${
            t.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/40 shadow-slate-900/30'
              : t.type === 'error'
              ? 'bg-rose-900 text-white border-rose-500/40 shadow-rose-900/30'
              : t.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-500/40'
              : 'bg-slate-900 text-white border-blue-500/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{t.message}</span>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
