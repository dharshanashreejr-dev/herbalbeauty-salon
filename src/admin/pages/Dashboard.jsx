import { useMemo, useState } from 'react';
import {
  ShoppingBag, CalendarDays, Users, IndianRupee, AlertTriangle, UserCheck, Plus, CalendarPlus, PackageSearch, ArrowRight
} from 'lucide-react';
import { useStore } from '../store.jsx';
import {
  inr, fmtDate, TODAY, LOW_STOCK, ORDER_STATUSES, APPOINTMENT_STATUSES, ACTIVITY
} from '../data/mockData.js';
import {
  orderTotal, revenueSeries, unitsSold, countBy, productRevenue, appointmentRevenue
} from '../utils.js';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import Avatar from '../components/Avatar.jsx';
import { AreaChart, Donut, HBars } from '../components/Charts.jsx';
import DitherVeil from '../reactbits/DitherVeil.jsx';
import SafeEffect from '../components/SafeEffect.jsx';

const PERIODS = [
  { id: '3', label: 'Last 3 months', n: 3 },
  { id: '6', label: 'Last 6 months', n: 6 },
  { id: '7', label: 'Apr to Oct', n: 7 }
];

export default function Dashboard({ user, onNavigate }) {
  const { products, orders, appointments, customers, staff } = useStore();
  const [period, setPeriod] = useState('6');
  const isAdmin = user.role === 'Admin';

  const series = useMemo(() => {
    const all = revenueSeries(orders, appointments, products);
    const n = PERIODS.find((p) => p.id === period).n;
    return all.slice(-n);
  }, [orders, appointments, products, period]);

  const totalRevenue = productRevenue(orders, products) + appointmentRevenue(appointments);
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK);
  const available = staff.filter((s) => s.availability === 'Available').length;
  const todays = appointments.filter((a) => a.date === TODAY).sort((a, b) => a.time.localeCompare(b.time));
  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const staffName = (id) => staff.find((s) => s.id === id)?.name || 'Unassigned';

  return (
    <div className="page">
      <section className="banner">
        <div className="banner-copy">
          <span className="eyebrow">{fmtDate(TODAY)}</span>
          <h2>Good morning, {user.name.split(' ')[0]}</h2>
          <p>
            {todays.length} appointments are scheduled today
            {isAdmin ? ` and ${orders.filter((o) => o.status === 'Pending').length} orders are waiting to be processed.` : '.'}
          </p>
          <div className="banner-actions">
            {isAdmin && <button className="btn btn-primary" onClick={() => onNavigate('products', 'add')}><Plus size={17} />Add product</button>}
            <button className="btn btn-light" onClick={() => onNavigate('appointments', 'add')}><CalendarPlus size={17} />New appointment</button>
            {isAdmin && <button className="btn btn-light" onClick={() => onNavigate('inventory')}><PackageSearch size={17} />Check inventory</button>}
          </div>
        </div>
        <div className="banner-art" aria-hidden="true">
          <SafeEffect fallback={<img className="banner-fallback" src="/hero.svg" alt="" />}>
          <DitherVeil
            src="/hero.svg"
            fit="cover"
            pattern="floyd"
            pixelSize={2}
            inkColor="#1f3a2e"
            paperColor="#f6ece4"
            revealRadius={150}
            softness={0.7}
            linger={1.2}
            wander
          />
          </SafeEffect>
        </div>
      </section>

      <div className="toolbar">
        <h3 className="section-title">Overview</h3>
        <label className="select-inline">
          <span>Period</span>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </label>
      </div>

      <div className="stat-grid">
        {isAdmin && <StatCard icon={ShoppingBag} label="Total product orders" value={orders.length} hint={`${orders.filter((o) => o.status === 'Delivered').length} delivered`} tone="rose" />}
        <StatCard icon={CalendarDays} label="Total appointments" value={appointments.length} hint={`${todays.length} today`} tone="sage" />
        <StatCard icon={Users} label="Total customers" value={customers.length} hint="Across all tiers" tone="sand" />
        {isAdmin && <StatCard icon={IndianRupee} label="Total revenue (sample)" value={inr(totalRevenue)} hint="Paid orders and services" tone="forest" />}
        {isAdmin && <StatCard icon={AlertTriangle} label="Low-stock products" value={lowStock.length} hint={`${LOW_STOCK} units or fewer`} tone="amber" />}
        <StatCard icon={UserCheck} label="Available specialists" value={available} hint={`of ${staff.length} team members`} tone="sage" />
      </div>

      <div className="grid-2">
        {isAdmin && (
          <div className="card">
            <div className="card-head"><h3>Revenue overview</h3><span className="muted">Products plus services, sample data</span></div>
            <AreaChart data={series} valueKey="total" xKey="month" />
          </div>
        )}
        {isAdmin && (
          <div className="card">
            <div className="card-head"><h3>Product sales overview</h3><span className="muted">Units sold</span></div>
            <HBars data={unitsSold(orders, products).slice(0, 6)} format={(n) => `${n} units`} />
          </div>
        )}
        <div className="card">
          <div className="card-head"><h3>Appointment statistics</h3><span className="muted">By status</span></div>
          <Donut data={countBy(appointments, 'status', APPOINTMENT_STATUSES)} centerLabel="Bookings" centerValue={appointments.length} />
        </div>
        {isAdmin && (
          <div className="card">
            <div className="card-head"><h3>Order status distribution</h3><span className="muted">All orders</span></div>
            <Donut data={countBy(orders, 'status', ORDER_STATUSES)} centerLabel="Orders" centerValue={orders.length} />
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Today's appointments</h3>
            <button className="link-btn" onClick={() => onNavigate('appointments')}>View all<ArrowRight size={14} /></button>
          </div>
          <ul className="timeline">
            {todays.length === 0 && <li className="muted">No appointments today.</li>}
            {todays.map((a) => (
              <li key={a.id}>
                <span className="time">{a.time}</span>
                <div><strong>{a.customer}</strong><span className="muted">{a.service} with {staffName(a.specialistId)}</span></div>
                <Badge>{a.status}</Badge>
              </li>
            ))}
          </ul>
        </div>

        {isAdmin ? (
          <div className="card">
            <div className="card-head">
              <h3>Recent orders</h3>
              <button className="link-btn" onClick={() => onNavigate('orders')}>View all<ArrowRight size={14} /></button>
            </div>
            <ul className="list">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <div><strong>{o.id}</strong><span className="muted">{o.customer}</span></div>
                  <div className="right"><strong>{inr(orderTotal(o, products))}</strong><Badge>{o.status}</Badge></div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="card">
            <div className="card-head"><h3>Recent customer activity</h3></div>
            <ul className="list">
              {ACTIVITY.map((a, i) => (
                <li key={i}><div><strong>{a.who}</strong><span className="muted">{a.what}</span></div><span className="muted">{a.when}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <h3>Low-stock alerts</h3>
              <button className="link-btn" onClick={() => onNavigate('inventory')}>Manage<ArrowRight size={14} /></button>
            </div>
            <ul className="list">
              {lowStock.length === 0 && <li className="muted">All products are well stocked.</li>}
              {lowStock.map((p) => (
                <li key={p.id}>
                  <div><strong>{p.name}</strong><span className="muted">{p.id}</span></div>
                  <Badge tone={p.stock === 0 ? 'red' : 'amber'}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div className="card-head"><h3>Recent customer activity</h3></div>
            <ul className="list">
              {ACTIVITY.map((a, i) => (
                <li key={i}>
                  <div className="row-gap"><Avatar name={a.who} size={34} index={i} /><div><strong>{a.who}</strong><span className="muted">{a.what}</span></div></div>
                  <span className="muted">{a.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
