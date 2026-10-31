import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { getSubs, saveSubs, getProducts, getInvoices, getPayments, invoiceStatus, fmt } from "../store.js";

const toMonthly = { daily: 30, weekly: 4.33, monthly: 1, yearly: 1 / 12 };

export default function Dashboard() {
  const products = getProducts();
  const [subs, setSubs] = useState(getSubs());
  const [form, setForm] = useState({ customer: "", productId: "", qty: "1", cycle: "monthly" });
  useEffect(() => saveSubs(subs), [subs]);

  const invoices = getInvoices(), payments = getPayments();
  const collected = payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = invoices.reduce((s, i) => s + invoiceStatus(i, payments).due, 0);
  const active = subs.filter((s) => s.status === "active");
  const mrr = active.reduce((sum, s) => sum + s.price * s.qty * toMonthly[s.cycle], 0);

  const add = (e) => {
    e.preventDefault();
    const p = products.find((x) => String(x.id) === form.productId);
    if (!p) return;
    setSubs([...subs, {
      id: Date.now(), customer: form.customer, productId: p.id, productName: p.name,
      price: p.price, tax: p.tax, qty: Number(form.qty), cycle: form.cycle, status: "active",
    }]);
    setForm({ ...form, customer: "", qty: "1" });
  };
  const setStatus = (id, status) => setSubs(subs.map((s) => (s.id === id ? { ...s, status } : s)));

  return (
    <Layout>
      <div className="kpis">
        <div className="card"><p>Active subscriptions</p><b>{active.length}</b></div>
        <div className="card"><p>MRR · ARR</p><b>{fmt(mrr)}</b><small className="empty">ARR {fmt(mrr * 12)}</small></div>
        <div className="card"><p>Collected</p><b>{fmt(collected)}</b></div>
        <div className="card"><p>Outstanding</p><b>{fmt(outstanding)}</b></div>
      </div>

      <div className="card">
        <h3>Subscriptions</h3>
        {products.length === 0 ? (
          <p className="empty" style={{ margin: "14px 0" }}>Add a product first on the <Link to="/products" className="ok">Products</Link> page.</p>
        ) : (
          <form className="form-row form-5" onSubmit={add}>
            <div><label>Customer</label><input required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></div>
            <div><label>Product</label>
              <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                <option value="">Choose…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({fmt(p.price)})</option>)}
              </select>
            </div>
            <div><label>Quantity</label><input type="number" min="1" required value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
            <div><label>Billing cycle</label>
              <select value={form.cycle} onChange={(e) => setForm({ ...form, cycle: e.target.value })}>
                <option value="daily">Daily</option><option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
              </select>
            </div>
            <button className="btn btn-primary">Add</button>
          </form>
        )}
        <table>
          <thead><tr><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Cycle</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {subs.length === 0 && <tr><td colSpan="7" className="empty">No subscriptions yet.</td></tr>}
            {subs.map((s) => (
              <tr key={s.id}>
                <td>{s.customer}</td><td>{s.productName}</td><td>{s.qty}</td><td>{fmt(s.price * s.qty)}</td><td>{s.cycle}</td>
                <td><span className={`badge ${s.status}`}>{s.status}</span></td>
                <td style={{ display: "flex", gap: 6 }}>
                  {s.status === "active" && <button className="btn btn-ghost" onClick={() => setStatus(s.id, "paused")}>Pause</button>}
                  {s.status === "paused" && <button className="btn btn-ghost" onClick={() => setStatus(s.id, "active")}>Resume</button>}
                  {s.status !== "closed" && <button className="btn btn-ghost" onClick={() => setStatus(s.id, "closed")}>Close</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
