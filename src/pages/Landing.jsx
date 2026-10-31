import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";
import { features, today, withUs, lifecycle, roles, plans, faqs } from "../data.js";

export default function Landing() {
  return (
    <>
      <div className="hero">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="brand"><span className="logo">∞</span>Brightloop</Link>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#lifecycle">Lifecycle</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="nav-actions">
              <Link to="/auth?mode=login">Log in</Link>
              <Link to="/auth?mode=signup" className="btn btn-primary">Get started</Link>
            </div>
          </nav>

          <div className="hero-grid">
            <div>
              <span className="pill">✦ Subscription operating system</span>
              <h1>Revenue that <span className="accent">loops</span> itself, every month.</h1>
              <p className="lead">
                Products, plans, subscriptions, invoices, payments and reports — one platform
                replacing the spreadsheet, the reminders and the manual invoices.
              </p>
              <div className="cta">
                <Link to="/auth?mode=signup" className="btn btn-primary">Start free →</Link>
                <Link to="/auth?mode=login" className="btn btn-ghost">Log in</Link>
              </div>
              <div className="stats">
                <div><b>4</b><span>Billing cycles</span></div>
                <div><b>3</b><span>User roles</span></div>
                <div><b>0</b><span>Manual invoices</span></div>
              </div>
            </div>
            <img src={hero} alt="Brightloop 3D loop" className="hero-img" />
          </div>
        </div>
      </div>

      <section className="block container">
        <span className="eyebrow">The challenge</span>
        <h2>How things run today — and how they should.</h2>
        <div className="grid-2">
          <div className="card">
            <h3>Today</h3>
            <ul className="list">
              {today.map(([k, v]) => (
                <li key={k}><span className="x">✕</span><span><b>{k}:</b> <span style={{ color: "var(--muted)" }}>{v}</span></span></li>
              ))}
            </ul>
          </div>
          <div className="card highlight">
            <h3 className="accent">With Brightloop</h3>
            <ul className="list">
              {withUs.map((t) => <li key={t}><span className="ok">✓</span>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="features" className="block container">
        <span className="eyebrow">Everything included</span>
        <h2>One backbone for the entire subscription business</h2>
        <div className="grid-3">
          {features.map((f) => (
            <div className="card" key={f.title}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="lifecycle" className="block container">
        <span className="eyebrow">Subscription lifecycle</span>
        <h2>Every state change validated, every step tracked.</h2>
        <div className="steps">
          {lifecycle.map((s, i) => (
            <div className="card step" key={s}><b>{i + 1}</b>{s}</div>
          ))}
        </div>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          Active subscriptions can also be paused, resumed, cancelled early or renewed when the plan allows it.
        </p>
        <div className="grid-3">
          <div className="card"><h3>1. Quote</h3><p>Staff build a quotation from a plan, product, variant and quantity.</p></div>
          <div className="card"><h3>2. Bill</h3><p>Run billing — invoices are created with tax, discounts and the next billing date.</p></div>
          <div className="card"><h3>3. Collect</h3><p>Record payments; invoices move from confirmed to paid automatically.</p></div>
        </div>
      </section>

      <section className="block container">
        <span className="eyebrow">Built for every team</span>
        <h2>Admin, staff and customers — each with the right access</h2>
        <div className="grid-3">
          {roles.map((r) => (
            <div className="card" key={r.name}><h3>{r.name}</h3><p>{r.text}</p></div>
          ))}
        </div>
      </section>

      <section id="pricing" className="block container">
        <span className="eyebrow">Plans</span>
        <h2>Simple pricing that scales with you</h2>
        <div className="grid-3">
          {plans.map((p) => (
            <div className={`card ${p.popular ? "highlight" : ""}`} key={p.name}>
              <h3>{p.name}</h3>
              <div className="price">{p.price}<small>{p.per}</small></div>
              <ul className="list">{p.items.map((i) => <li key={i}><span className="ok">✓</span>{i}</li>)}</ul>
              <Link to="/auth?mode=signup" className={`btn ${p.popular ? "btn-primary" : "btn-ghost"}`} style={{ marginTop: 20 }}>Choose {p.name}</Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="block container">
        <h2>Frequently asked questions</h2>
        {faqs.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </section>

      <section className="container">
        <div className="final">
          <h2>Retire the spreadsheet this month.</h2>
          <p>Create your account — the first account becomes the admin.</p>
          <Link to="/auth?mode=signup" className="btn btn-primary">Create account</Link>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} Brightloop. All rights reserved.</footer>
    </>
  );
}
