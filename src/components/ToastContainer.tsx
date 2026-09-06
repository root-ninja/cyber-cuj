'use client';

import React, { useState, useEffect } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

let toastHandler: ((msg: string, type?: 'info' | 'success' | 'error') => void) | null = null;

export function cyberToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  if (toastHandler) {
    toastHandler(message, type);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastHandler = (message, type = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    return () => {
      toastHandler = null;
    };
  }, []);

  return (
    <div id="toast-container" className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type === 'error' ? 'error' : ''}`}>
          <span style={{ fontWeight: 'bold' }}>{toast.type === 'error' ? '[!]' : '[+]'}</span>
          <span dangerouslySetInnerHTML={{ __html: toast.message }} />
        </div>
      ))}
    </div>
  );
}
