// Simple browser-storage "database" so the demo works without a backend.
const USERS = "bl_users";
const SESSION = "bl_session";

const read = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const validPassword = (p) =>
  p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);

export function signup(name, email, password) {
  const users = read(USERS, []);
  if (users.find((u) => u.email === email)) throw new Error("Email already registered");
  if (!validPassword(password))
    throw new Error("Password needs 8+ chars, upper, lower, number and symbol");
  const role = users.length === 0 ? "admin" : "customer"; // first account = admin
  const user = { name, email, password, role };
  write(USERS, [...users, user]);
  write(SESSION, user);
  return user;
}

export function login(email, password) {
  const user = read(USERS, []).find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  write(SESSION, user);
  return user;
}

export const currentUser = () => read(SESSION, null);
export const logout = () => localStorage.removeItem(SESSION);

// Tables
export const getSubs = () => read("bl_subs", []);
export const saveSubs = (s) => write("bl_subs", s);
export const getProducts = () => read("bl_products", []);
export const saveProducts = (p) => write("bl_products", p);
export const getInvoices = () => read("bl_invoices", []);
export const saveInvoices = (i) => write("bl_invoices", i);
export const getPayments = () => read("bl_payments", []);
export const savePayments = (p) => write("bl_payments", p);

export const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// Billing period key, e.g. "2026-10" for monthly, "2026" for yearly
export function periodKey(cycle, d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0");
  if (cycle === "yearly") return `${y}`;
  if (cycle === "monthly") return `${y}-${m}`;
  if (cycle === "weekly") {
    const start = new Date(y, 0, 1);
    const w = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
    return `${y}-W${w}`;
  }
  return d.toISOString().slice(0, 10); // daily
}

// Amount paid against an invoice and its status
export function invoiceStatus(inv, payments) {
  const paid = payments.filter((p) => p.invoiceId === inv.id).reduce((s, p) => s + p.amount, 0);
  const due = inv.total - paid;
  const status = due <= 0 ? "paid" : paid > 0 ? "partial" : "unpaid";
  return { paid, due: Math.max(due, 0), status };
}
