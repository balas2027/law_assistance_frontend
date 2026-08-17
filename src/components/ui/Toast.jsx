import { useUiStore } from '../../stores/uiStore';
import Icon from '../ui/Icon';

const STYLES = {
  success: { icon: 'check_circle', box: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
  error:   { icon: 'error',         box: 'bg-red-50 border-red-300 text-red-700' },
  info:    { icon: 'info',          box: 'bg-blue-50 border-blue-300 text-blue-800' },
};

export default function Toast() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const style = STYLES[toast.type] || STYLES.info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 shadow-level-1 animate-fade-in-up ${style.box}`}
          >
            <Icon name={style.icon} size={18} className="mt-0.5 shrink-0" />
            <p className="font-body-md text-[13px] leading-snug flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 shrink-0 mt-0.5"
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}