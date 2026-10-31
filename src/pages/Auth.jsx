import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login, signup } from "../store.js";

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "signup") signup(form.name, form.email, form.password);
      else login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrap hero">
      <div className="card auth-card">
        <Link to="/" className="brand"><span className="logo">∞</span>Brightloop</Link>
        <div className="tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setParams({ mode: "login" })}>Log in</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setParams({ mode: "signup" })}>Sign up</button>
        </div>
        <form onSubmit={submit}>
          {mode === "signup" && (<><label>Full name</label><input required value={form.name} onChange={set("name")} /></>)}
          <label>Email</label>
          <input type="email" required value={form.email} onChange={set("email")} />
          <label>Password</label>
          <input type="password" required value={form.password} onChange={set("password")} />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
            {mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
