const TONE = {
  Active: 'green', Draft: 'sand', 'Out of Stock': 'red',
  Pending: 'amber', Processing: 'blue', Shipped: 'violet', Delivered: 'green', Cancelled: 'red',
  Paid: 'green', Failed: 'red',
  Confirmed: 'blue', 'Checked In': 'violet', Completed: 'green',
  Available: 'green', 'With Client': 'amber', 'Off Duty': 'sand',
  'In Stock': 'green', 'Low Stock': 'amber',
  New: 'sand', Regular: 'blue', Silver: 'slate', Gold: 'gold', VIP: 'rose'
};

export default function Badge({ children, tone }) {
  return <span className={`badge badge-${tone || TONE[children] || 'sand'}`}>{children}</span>;
}
