import { lazy, Suspense, useState } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle, Info, ShieldCheck, UserRound } from 'lucide-react';
import { useStore } from '../store.jsx';
import Brand from '../components/Brand.jsx';
import DepthText from '../reactbits/DepthText.jsx';
import SafeEffect from '../components/SafeEffect.jsx';

const AeroShards = lazy(() => import('../reactbits/AeroShards.jsx'));

const DEMO = {
  Admin: { email: 'admin@maisonbloom.demo', password: 'Bloom@123' },
  Staff: { email: 'staff@maisonbloom.demo', password: 'Staff@123' }
};

export default function Login({ onSuccess }) {
  const { login, notify } = useStore();
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [shardsFailed, setShardsFailed] = useState(false);
  const webgpu = typeof navigator !== 'undefined' && !!navigator.gpu;

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    const res = login(email, password, role);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    notify(`Welcome back, ${res.user.name}.`);
    onSuccess();
  };

  const fill = (r) => {
    setRole(r);
    setEmail(DEMO[r].email);
    setPassword(DEMO[r].password);
    setErrors({});
    setFormError('');
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="hero-bg" aria-hidden="true">
          {webgpu && !shardsFailed && (
            <SafeEffect><Suspense fallback={null}>
              <AeroShards
                backgroundColor="#14281f"
                shardColor="#a9bba5"
                accentColor="#e8c9c1"
                detail="balanced"
                material="satin"
                density={0.9}
                shardSize={1}
                bloom={0.35}
                grain={0.04}
                interaction="none"
                holdToGather={false}
                rippleIntensity={0}
                speed={0.6}
                onError={() => setShardsFailed(true)}
              />
            </Suspense></SafeEffect>
          )}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <Brand light />
          <div className="hero-copy">
            <DepthText
              text="The Velvet Touch"
              layers={22}
              depth={1.6}
              faceColor="#f6ece4"
              depthColor="#c98f84"
              tilt={6}
              fontSize="clamp(2.6rem, 5.2vw, 4.6rem)"
              fontWeight={800}
            />
            <p>
              A calm, considered workspace for running your salon, skincare boutique and wellness studio.
              Orders, appointments, clients and specialists in one place.
            </p>
          </div>
          <span className="hero-foot">Prepared by D-Sites Infosolutions - Client UI Demo</span>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={submit} noValidate>
          <a href="/" className="muted" style={{ display: 'inline-block', marginBottom: 12, fontSize: 13 }}>&larr; Back to website</a>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to the Admin and Staff panel.</p>

          <div className="role-switch" role="tablist" aria-label="Sign in as">
            {['Admin', 'Staff'].map((r) => (
              <button type="button" role="tab" aria-selected={role === r} key={r} className={role === r ? 'active' : ''} onClick={() => { setRole(r); setFormError(''); }}>
                {r === 'Admin' ? <ShieldCheck size={16} /> : <UserRound size={16} />}{r}
              </button>
            ))}
          </div>

          <label className={`field ${errors.email ? 'has-error' : ''}`}>
            <span className="field-label">Email address</span>
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={DEMO[role].email} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <div className={`field ${errors.password ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="input-with-btn">
              <input id="login-password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
              <button type="button" className="icon-btn" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {formError && <div className="alert alert-error"><AlertCircle size={18} />{formError}</div>}

          <button type="submit" className="btn btn-primary btn-block"><LogIn size={18} />Sign in as {role}</button>

          <div className="demo-box">
            <strong><Info size={15} />Demo credentials</strong>
            <div className="demo-row">
              <span>Admin: admin@maisonbloom.demo / Bloom@123</span>
              <button type="button" className="link-btn" onClick={() => fill('Admin')}>Use</button>
            </div>
            <div className="demo-row">
              <span>Staff: staff@maisonbloom.demo / Staff@123</span>
              <button type="button" className="link-btn" onClick={() => fill('Staff')}>Use</button>
            </div>
          </div>
          <p className="disclaimer">
            This is a frontend demonstration only. Credentials are hardcoded in the browser and this is not
            production authentication or secure access control.
          </p>
        </form>
      </section>
    </div>
  );
}
