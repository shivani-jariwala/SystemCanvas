/**
 * ToastProvider — react-hot-toast configured with dark theme.
 * Include once at the app root.
 */
import { Toaster } from 'react-hot-toast';

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#e5e7eb',
          border: '1px solid rgba(75, 85, 99, 0.6)',
          borderRadius: '12px',
          fontSize: '14px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#1f2937' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#1f2937' },
        },
      }}
    />
  );
}

export default ToastProvider;
