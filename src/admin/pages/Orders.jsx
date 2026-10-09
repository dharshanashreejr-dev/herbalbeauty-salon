import { useMemo, useState } from 'react';
import { Search, Eye, MapPin } from 'lucide-react';
import { useStore } from '../store.jsx';
import { ORDER_STATUSES, PAYMENT_STATUSES, inr, fmtDate } from '../data/mockData.js';
import { orderTotal, itemCount, productOf } from '../utils.js';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';

export default function Orders() {
  const { orders, setOrders, products, notify } = useStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [payment, setPayment] = useState('All');
  const [openId, setOpenId] = useState(null);

  const rows = useMemo(
    () =>
      [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).filter((o) =>
        (status === 'All' || o.status === status) &&
        (payment === 'All' || o.payment === payment) &&
        (!q.trim() || `${o.id} ${o.customer}`.toLowerCase().includes(q.trim().toLowerCase()))
      ),
    [orders, q, status, payment]
  );
  const open = orders.find((o) => o.id === openId);

  const update = (id, patch, message) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    notify(message);
  };

  const summary = (o) => o.items.map((i) => `${productOf(products, i.productId)?.name || 'Discontinued product'} x${i.qty}`).join(', ');

  const columns = [
    { key: 'id', label: 'Order', render: (o) => <strong>{o.id}</strong> },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date', render: (o) => fmtDate(o.date) },
    { key: 'items', label: 'Items', render: (o) => <span className="clip" title={summary(o)}>{itemCount(o)} item(s): {summary(o)}</span> },
    { key: 'total', label: 'Total', render: (o) => <strong>{inr(orderTotal(o, products))}</strong> },
    { key: 'payment', label: 'Payment', render: (o) => <Badge>{o.payment}</Badge> },
    { key: 'status', label: 'Fulfilment', render: (o) => (
      <select className="status-select" value={o.status} onClick={(e) => e.stopPropagation()}
        onChange={(e) => update(o.id, { status: e.target.value }, `${o.id} marked as ${e.target.value}.`)} aria-label={`Status for ${o.id}`}>
        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
    ) },
    { key: 'view', label: '', width: '60px', render: (o) => <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setOpenId(o.id); }} aria-label={`View ${o.id}`}><Eye size={17} /></button> }
  ];

  return (
    <div className="page">
      <PageHeader title="Order management" subtitle="Sample orders only. No payment gateway or e-commerce backend is connected." />
      <div className="filters">
        <div className="search-box"><Search size={17} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order ID or customer" aria-label="Search orders" /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by fulfilment status">
          <option value="All">All fulfilment statuses</option>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={payment} onChange={(e) => setPayment(e.target.value)} aria-label="Filter by payment status">
          <option value="All">All payment statuses</option>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card flush"><DataTable columns={columns} rows={rows} onRowClick={(o) => setOpenId(o.id)} /></div>

      {open && (
        <Modal title={`Order ${open.id}`} subtitle={`Placed on ${fmtDate(open.date)} by ${open.customer}`} wide onClose={() => setOpenId(null)}
          footer={<button className="btn btn-primary" onClick={() => setOpenId(null)}>Done</button>}>
          <div className="detail-grid">
            <div>
              <h4 className="mini-title">Items</h4>
              <ul className="list">
                {open.items.map((i) => {
                  const p = productOf(products, i.productId);
                  return (
                    <li key={i.productId}>
                      <div><strong>{p?.name || 'Discontinued product'}</strong><span className="muted">{i.qty} x {inr(p?.price || 0)}</span></div>
                      <strong>{inr((p?.price || 0) * i.qty)}</strong>
                    </li>
                  );
                })}
                <li className="total-row"><strong>Order total</strong><strong>{inr(orderTotal(open, products))}</strong></li>
              </ul>
              <p className="muted row-gap"><MapPin size={15} />{open.address}</p>
            </div>
            <div>
              <h4 className="mini-title">Update order</h4>
              <label className="field"><span className="field-label">Fulfilment status</span>
                <select value={open.status} onChange={(e) => update(open.id, { status: e.target.value }, `${open.id} marked as ${e.target.value}.`)}>
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="field"><span className="field-label">Payment status</span>
                <select value={open.payment} onChange={(e) => update(open.id, { payment: e.target.value }, `Payment for ${open.id} set to ${e.target.value}.`)}>
                  {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <div className="row-gap"><Badge>{open.status}</Badge><Badge>{open.payment}</Badge></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
