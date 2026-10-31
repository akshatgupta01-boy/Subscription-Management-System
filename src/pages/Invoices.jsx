import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { getSubs, getInvoices, saveInvoices, getPayments, invoiceStatus, periodKey, fmt } from "../store.js";

export default function Invoices() {
  const [invoices, setInvoices] = useState(getInvoices());
  const [msg, setMsg] = useState("");
  const payments = getPayments();
  useEffect(() => saveInvoices(invoices), [invoices]);

  // Create one invoice per active subscription per billing period. Duplicates are skipped.
  const runBilling = () => {
    const created = [];
    let skipped = 0;
    getSubs().filter((s) => s.status === "active").forEach((s) => {
      const period = periodKey(s.cycle);
      const exists = [...invoices, ...created].some((i) => i.subId === s.id && i.period === period);
      if (exists) { skipped++; return; }
      const subtotal = s.price * s.qty;
      const tax = (subtotal * (s.tax || 0)) / 100;
      created.push({
        id: Date.now() + created.length, number: `INV-${String(invoices.length + created.length + 1).padStart(4, "0")}`,
        subId: s.id, customer: s.customer, product: s.productName, period,
        subtotal, tax, total: subtotal + tax, date: new Date().toISOString().slice(0, 10),
      });
    });
    setInvoices([...invoices, ...created]);
    setMsg(`${created.length} invoice(s) created, ${skipped} skipped (already billed this period).`);
  };

  return (
    <Layout>
      <div className="card">
        <div className="row-between">
          <h3>Invoices</h3>
          <button className="btn btn-primary" onClick={runBilling}>Run billing</button>
        </div>
        {msg && <p className="ok" style={{ margin: "10px 0" }}>{msg}</p>}
        <table>
          <thead><tr><th>Number</th><th>Date</th><th>Customer</th><th>Product</th><th>Period</th><th>Subtotal</th><th>Tax</th><th>Total</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            {invoices.length === 0 && <tr><td colSpan="10" className="empty">No invoices yet — click “Run billing”.</td></tr>}
            {invoices.map((i) => {
              const st = invoiceStatus(i, payments);
              return (
                <tr key={i.id}>
                  <td>{i.number}</td><td>{i.date}</td><td>{i.customer}</td><td>{i.product}</td><td>{i.period}</td>
                  <td>{fmt(i.subtotal)}</td><td>{fmt(i.tax)}</td><td>{fmt(i.total)}</td><td>{fmt(st.due)}</td>
                  <td><span className={`badge ${st.status}`}>{st.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
