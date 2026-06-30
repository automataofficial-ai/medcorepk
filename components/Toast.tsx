'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
    textTitle: '#6EE7B7',
    textBody: '#D1FAE5',
    iconColor: '#10B981',
  },
  error: {
    icon: AlertCircle,
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
    textTitle: '#FCA5A5',
    textBody: '#FECACA',
    iconColor: '#EF4444',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    textTitle: '#FCD34D',
    textBody: '#FEF3C7',
    iconColor: '#F59E0B',
  },
  info: {
    icon: Info,
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.3)',
    textTitle: '#93C5FD',
    textBody: '#BFDBFE',
    iconColor: '#3B82F6',
  },
};

export function ToastItem({ id, type, title, message, duration = 5000, action, onClose }: ToastProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-md transition-all duration-300 animate-slideIn"
      style={{
        background: config.bg,
        border: `1.5px solid ${config.border}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: config.iconColor }} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: config.textTitle }}>
          {title}
        </p>
        {message && (
          <p className="text-sm mt-1" style={{ color: config.textBody }}>
            {message}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-semibold mt-2 transition-opacity hover:opacity-80"
            style={{ color: config.textTitle }}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
        style={{ color: config.textTitle }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
