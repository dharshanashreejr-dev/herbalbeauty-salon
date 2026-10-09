import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useStore } from '../store.jsx';

export default function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'error' ? <AlertTriangle size={18} /> : t.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
