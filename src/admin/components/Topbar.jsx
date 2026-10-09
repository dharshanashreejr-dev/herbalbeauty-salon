import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, ChevronDown, Menu, RotateCcw, Search, LogOut, ShieldCheck } from 'lucide-react';
import { NAV } from '../nav.js';
import { useStore } from '../store.jsx';
import { LOW_STOCK } from '../data/mockData.js';
import Avatar from './Avatar.jsx';

export default function Topbar({ user, page, onNavigate, onMenu, onLogout }) {
  const { products, orders, appointments, resetDemo } = useStore();
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(null); // 'notif' | 'profile' | null
  const ref = useRef(null);
  const current = NAV.find((n) => n.id === page);
  const allowed = NAV.filter((n) => n.roles.includes(user.role));

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setMenu(null);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const matches = useMemo(
    () => (q.trim() ? allowed.filter((n) => n.label.toLowerCase().includes(q.trim().toLowerCase())) : []),
    [q, allowed]
  );

  const notifications = useMemo(() => {
    const list = [];
    if (user.role === 'Admin') {
      products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).forEach((p) => list.push({ id: p.id, text: `${p.name} is low on stock (${p.stock} left)`, to: 'inventory' }));
      products.filter((p) => p.stock === 0).forEach((p) => list.push({ id: p.id + 'o', text: `${p.name} is out of stock`, to: 'inventory' }));
      orders.filter((o) => o.status === 'Pending').forEach((o) => list.push({ id: o.id, text: `Order ${o.id} is awaiting processing`, to: 'orders' }));
    }
    appointments.filter((a) => a.status === 'Pending').forEach((a) => list.push({ id: a.id, text: `Appointment ${a.id} needs confirmation`, to: 'appointments' }));
    return list;
  }, [products, orders, appointments, user.role]);

  return (
    <header className="topbar" ref={ref}>
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
      <div className="crumbs">
        <span className="crumb-trail">The Velvet Touch / {user.role} / {current?.label || 'Access'}</span>
        <h1>{current?.label || 'Access Denied'}</h1>
      </div>

      <div className="topbar-search">
        <Search size={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page..." aria-label="Jump to a page" />
        {matches.length > 0 && (
          <ul className="search-pop">
            {matches.map((m) => (
              <li key={m.id}><button onClick={() => { onNavigate(m.id); setQ(''); }}><m.icon size={16} />{m.label}</button></li>
            ))}
          </ul>
        )}
      </div>

      <div className="topbar-actions">
        <div className="pop-anchor">
          <button className="icon-btn" onClick={() => setMenu(menu === 'notif' ? null : 'notif')} aria-label="Notifications">
            <Bell size={19} />
            {notifications.length > 0 && <span className="dot">{notifications.length}</span>}
          </button>
          {menu === 'notif' && (
            <div className="popover">
              <h4>Notifications</h4>
              {notifications.length === 0 && <p className="muted pad">You are all caught up.</p>}
              <ul>
                {notifications.map((n) => (
                  <li key={n.id}><button onClick={() => { onNavigate(n.to); setMenu(null); }}>{n.text}</button></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pop-anchor">
          <button className="profile-btn" onClick={() => setMenu(menu === 'profile' ? null : 'profile')} aria-label="Profile menu">
            <Avatar name={user.name} size={34} />
            <span className="profile-text"><strong>{user.name}</strong><em>{user.role}</em></span>
            <ChevronDown size={16} />
          </button>
          {menu === 'profile' && (
            <div className="popover popover-right">
              <div className="pop-profile">
                <strong>{user.name}</strong>
                <span className="muted">{user.email}</span>
                <span className="role-pill"><ShieldCheck size={14} />{user.role} (demo role)</span>
              </div>
              {user.role === 'Admin' && (
                <button className="pop-item" onClick={() => { resetDemo(); setMenu(null); }}><RotateCcw size={16} />Reset demo data</button>
              )}
              <button className="pop-item" onClick={onLogout}><LogOut size={16} />Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
