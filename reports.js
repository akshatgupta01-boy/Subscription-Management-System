
const customers = JSON.parse(localStorage.getItem("customers")) || [];
const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
const payments = JSON.parse(localStorage.getItem("payments")) || [];

const money = amount =>
    "₹" + Number(amount || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });

// Customer and subscription reports
document.getElementById("reportCustomers").textContent = customers.length;

document.getElementById("reportSubscriptions").textContent =
    subscriptions.length;

document.getElementById("activeSubscriptions").textContent =
    subscriptions.filter(s => s.status === "Active").length;

document.getElementById("pausedSubscriptions").textContent =
    subscriptions.filter(s => s.status === "Paused").length;

document.getElementById("closedSubscriptions").textContent =
    subscriptions.filter(s => s.status === "Closed").length;

// Payment reports
const totalRevenue = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0), 0
);

document.getElementById("reportRevenue").textContent =
    money(totalRevenue);

document.getElementById("totalTransactions").textContent =
    payments.length;

function getCollection(method) {
    return payments
        .filter(p => (p.method || "").toLowerCase() === method.toLowerCase())
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
}

document.getElementById("upiCollection").textContent =
    money(getCollection("UPI"));

document.getElementById("cardCollection").textContent =
    money(getCollection("Card"));

document.getElementById("cashCollection").textContent =
    money(getCollection("Cash"));

// Invoice reports
document.getElementById("totalInvoices").textContent =
    invoices.length;

document.getElementById("paidInvoices").textContent =
    invoices.filter(i => i.status === "Paid").length;

document.getElementById("unpaidInvoices").textContent =
    invoices.filter(i => i.status === "Pending").length;

document.getElementById("reportPending").textContent =
    invoices.filter(i => i.status === "Pending").length;

// Export CSV report
document.getElementById("exportReport").addEventListener("click", function() {

    const rows = [
        ["Report", "Value"],
        ["Total Customers", customers.length],
        ["Total Subscriptions", subscriptions.length],
        ["Active Subscriptions", subscriptions.filter(s => s.status === "Active").length],
        ["Paused Subscriptions", subscriptions.filter(s => s.status === "Paused").length],
        ["Closed Subscriptions", subscriptions.filter(s => s.status === "Closed").length],
        ["Total Revenue", totalRevenue],
        ["Total Transactions", payments.length],
        ["UPI Collection", getCollection("UPI")],
        ["Card Collection", getCollection("Card")],
        ["Cash Collection", getCollection("Cash")],
        ["Total Invoices", invoices.length],
        ["Paid Invoices", invoices.filter(i => i.status === "Paid").length],
        ["Unpaid Invoices", invoices.filter(i => i.status === "Pending").length]
    ];

    const csv = rows.map(row =>
        row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "subscription-business-report.csv";
    link.click();

    URL.revokeObjectURL(url);
});
