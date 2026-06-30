'use client';

import { useToast } from '@/context/ToastContext';
import { ToastItem } from '@/components/Toast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[9999] p-4 sm:p-6 pointer-events-none">
      <div className="space-y-3 flex flex-col items-end pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}
