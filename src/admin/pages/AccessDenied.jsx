import { ShieldAlert } from 'lucide-react';

export default function AccessDenied({ onBack }) {
  return (
    <div className="page denied">
      <div className="denied-card">
        <ShieldAlert size={42} />
        <h2>Access denied</h2>
        <p className="muted">Your Staff role does not include this page. This is a demo of role-based navigation and is not secure production access control.</p>
        <button className="btn btn-primary" onClick={onBack}>Back to dashboard</button>
      </div>
    </div>
  );
}
