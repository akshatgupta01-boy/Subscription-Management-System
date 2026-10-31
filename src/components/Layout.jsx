import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { currentUser, logout } from "../store.js";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = currentUser();
  useEffect(() => { if (!user) navigate("/auth?mode=login"); }, [user, navigate]);
  if (!user) return null;

  return (
    <div className="container">
      <div className="dash-top">
        <Link to="/" className="brand"><span className="logo">∞</span>Brightloop</Link>
        <div className="app-tabs">
          <NavLink to="/dashboard">Subscriptions</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/invoices">Invoices</NavLink>
          <NavLink to="/payments">Payments</NavLink>
        </div>
        <div className="nav-actions">
          <span style={{ color: "var(--muted)" }}>{user.name || user.email} · <b>{user.role}</b></span>
          <button className="btn btn-ghost" onClick={() => { logout(); navigate("/"); }}>Log out</button>
        </div>
      </div>
      {children}
    </div>
  );
}
