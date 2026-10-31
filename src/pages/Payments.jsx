import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { getInvoices, getPayments, savePayments, invoiceStatus, fmt } from "../store.js";

export default function Payments() {
  const invoices = getInvoices();
  const [payments, setPayments] = useState(getPayments());
  const [form, setForm] = useState({ invoiceId: "", amount: "", method: "cash" });
  const [error, setError] = useState("");
  useEffect(() => savePayments(payments), [payments]);

  const open = invoices.filter((i) => invoiceStatus(i, payments).due > 0);

  const add = (e) => {
    e.preventDefault();
    const inv = invoices.find((i) => String(i.id) === form.invoiceId);
    const amount = Number(form.amount);
    const { due } = invoiceStatus(inv, payments);
    if (amount <= 0 || amount > due) { setError(`Amount must be between ₹1 and ${fmt(due)}`); return; }
    setError("");
    setPayments([...payments, {
      id: Date.now(), invoiceId: inv.id, number: inv.number, customer: inv.customer,
      amount, method: form.method, date: new Date().toISOString().slice(0, 10),
    }]);
    setForm({ invoiceId: "", amount: "", method: "cash" });
  };

  return (
    <Layout>
      <div className="card">
        <h3>Record a payment</h3>
        {open.length === 0 ? (
          <p className="empty" style={{ margin: "14px 0" }}>No unpaid invoices.</p>
        ) : (
          <form className="form-row" onSubmit={add}>
            <div><label>Invoice</label>
              <select required value={form.invoiceId} onChange={(e) => {
                const inv = invoices.find((i) => String(i.id) === e.target.value);
                setForm({ ...form, invoiceId: e.target.value, amount: inv ? String(Math.round(invoiceStatus(inv, payments).due)) : "" });
              }}>
                <option value="">Choose…</option>
                {open.map((i) => <option key={i.id} value={i.id}>{i.number} · {i.customer} · due {fmt(invoiceStatus(i, payments).due)}</option>)}
              </select>
            </div>
            <div><label>Amount (₹)</label><input type="number" min="1" step="any" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div><label>Method</label>
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                <option value="cash">Cash</option><option value="bank">Bank</option><option value="card">Card</option>
              </select>
            </div>
            <button className="btn btn-primary">Record</button>
          </form>
        )}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Payment history</h3>
        <table>
          <thead><tr><th>Date</th><th>Invoice</th><th>Customer</th><th>Method</th><th>Amount</th></tr></thead>
          <tbody>
            {payments.length === 0 && <tr><td colSpan="5" className="empty">No payments yet.</td></tr>}
            {payments.map((p) => (
              <tr key={p.id}><td>{p.date}</td><td>{p.number}</td><td>{p.customer}</td><td>{p.method}</td><td>{fmt(p.amount)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
