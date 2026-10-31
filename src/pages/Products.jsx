import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { getProducts, saveProducts, fmt } from "../store.js";

const empty = { name: "", price: "", cost: "", tax: "18" };

export default function Products() {
  const [products, setProducts] = useState(getProducts());
  const [form, setForm] = useState(empty);
  useEffect(() => saveProducts(products), [products]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    setProducts([...products, {
      id: Date.now(), name: form.name,
      price: Number(form.price), cost: Number(form.cost || 0), tax: Number(form.tax || 0),
    }]);
    setForm(empty);
  };

  return (
    <Layout>
      <div className="card">
        <h3>Products</h3>
        <form className="form-row form-5" onSubmit={add}>
          <div><label>Name</label><input required value={form.name} onChange={set("name")} /></div>
          <div><label>Sales price (₹)</label><input type="number" min="0" required value={form.price} onChange={set("price")} /></div>
          <div><label>Cost price (₹)</label><input type="number" min="0" value={form.cost} onChange={set("cost")} /></div>
          <div><label>Tax %</label><input type="number" min="0" max="100" value={form.tax} onChange={set("tax")} /></div>
          <button className="btn btn-primary">Add</button>
        </form>
        <table>
          <thead><tr><th>Name</th><th>Sales price</th><th>Cost</th><th>Tax</th><th>Margin</th><th></th></tr></thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan="6" className="empty">No products yet — add one above.</td></tr>}
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{fmt(p.price)}</td><td>{fmt(p.cost)}</td><td>{p.tax}%</td>
                <td>{fmt(p.price - p.cost)}</td>
                <td><button className="btn btn-ghost" onClick={() => setProducts(products.filter((x) => x.id !== p.id))}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
