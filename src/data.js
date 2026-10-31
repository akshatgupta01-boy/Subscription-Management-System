export const today = [
  ["Customer subscriptions", "Tracked in a spreadsheet"],
  ["Renewals", "Remembered by whoever notices first"],
  ["Invoices", "Typed up by hand every month"],
  ["Payments", "Matched by scrolling through bank statements"],
  ["Revenue reports", "Built manually at the end of each quarter"],
];

export const withUs = [
  "Every subscription in one live register",
  "Renewals and closures happen on schedule",
  "Invoices generated automatically with tax & discounts",
  "Payments recorded against invoices, balances update instantly",
  "MRR, ARR and outstanding revenue on a live dashboard",
];

export const features = [
  { icon: "▦", title: "Products & variants", text: "Sales and cost price, notes, and variants with extra pricing — e.g. Odoo brand adds ₹560." },
  { icon: "↻", title: "Flexible plans", text: "Daily, weekly, monthly or yearly billing with minimum quantity, pause, renew and auto-close." },
  { icon: "⎙", title: "Recurring billing", text: "Bulk-generate invoices for every subscription due — duplicates are blocked automatically." },
  { icon: "%", title: "Discount rules", text: "Fixed or percentage, with minimum purchase, dates and usage limits. Admin-only control." },
  { icon: "₹", title: "Tax engine", text: "Per-product tax rates calculated on every invoice line after discounts." },
  { icon: "✓", title: "Payment tracking", text: "Record cash, bank or card payments. Paid, partial and overdue invoices at a glance." },
  { icon: "☺", title: "Customer portal", text: "Customers see only their own subscriptions, invoices and payment history." },
  { icon: "🔒", title: "Roles & security", text: "Admin, staff and customer roles enforced on every record in the database." },
  { icon: "📈", title: "Revenue analytics", text: "Collected vs outstanding, MRR, ARR, trends and recent activity — all from real records." },
];

export const lifecycle = ["Draft", "Quotation", "Confirmed", "Active", "Closed"];

export const roles = [
  { name: "Admin", text: "Products, plans, taxes, discounts, staff and full financial analytics." },
  { name: "Staff", text: "Customers, quotations, subscriptions, invoices and payment recording." },
  { name: "Customer", text: "Self-service portal for their own subscriptions, invoices and payments." },
];

// Pricing was not visible on the original site — these are sample values, edit freely.
export const plans = [
  { name: "Starter", price: "₹0", per: "/month", items: ["Up to 25 subscriptions", "1 admin", "Basic reports"] },
  { name: "Growth", price: "₹1,999", per: "/month", popular: true, items: ["Unlimited subscriptions", "5 staff seats", "Discounts & tax engine", "Customer portal"] },
  { name: "Scale", price: "₹4,999", per: "/month", items: ["Everything in Growth", "Unlimited staff", "Advanced analytics", "Priority support"] },
];

// Answers were collapsed on the original site — these are sample answers.
export const faqs = [
  ["Who can create discounts?", "Only admins can create and manage discount rules."],
  ["How are duplicate invoices prevented?", "Each subscription can only have one invoice per billing period; the system blocks duplicates."],
  ["Can customers pause or cancel?", "Yes, when the plan allows it, active subscriptions can be paused, resumed or cancelled early."],
  ["What makes a valid password?", "At least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol."],
  ["Do you take online card payments?", "Payments are recorded manually (cash, bank or card). Online gateways can be added later."],
];
