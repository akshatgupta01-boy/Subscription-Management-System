const customers = JSON.parse(localStorage.getItem("customers")) || [];
const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
const payments = JSON.parse(localStorage.getItem("payments")) || [];

const money = (amount) =>
  "₹" +
  Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

// Summary cards
const revenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

document.getElementById("dashRevenue").textContent = money(revenue);
document.getElementById("dashCustomers").textContent = customers.length;

document.getElementById("dashSubscriptions").textContent = subscriptions.filter(
  (s) => s.status === "Active",
).length;

document.getElementById("dashInvoices").textContent = invoices.filter(
  (i) => i.status !== "Paid",
).length;

// Subscription status
function countStatus(status) {
  return subscriptions.filter((s) => s.status === status).length;
}

document.getElementById("activeCount").textContent = countStatus("Active");
document.getElementById("pausedCount").textContent = countStatus("Paused");
document.getElementById("closedCount").textContent = countStatus("Closed");
document.getElementById("draftCount").textContent = countStatus("Draft");

// Recent payments
const recent = [...payments]
  .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
  .slice(0, 5);

const paymentTable = document.getElementById("recentPayments");

recent.forEach((p) => {
  const row = document.createElement("tr");

  [
    p.customerName || "Customer",
    p.invoiceId || "-",
    p.method || "-",
    p.paymentDate || "-",
    money(p.amount),
  ].forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  paymentTable.appendChild(row);
});

document.getElementById("noRecentPayments").style.display =
  recent.length === 0 ? "block" : "none";

// Revenue chart - last six months
const months = [];

for (let i = 5; i >= 0; i--) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - i);

  months.push({
    label: date.toLocaleString("en-IN", { month: "short" }),
    month: date.getMonth(),
    year: date.getFullYear(),
    total: 0,
  });
}

payments.forEach((p) => {
  const date = new Date(p.paymentDate);

  if (isNaN(date.getTime())) return;

  const month = months.find(
    (m) => m.month === date.getMonth() && m.year === date.getFullYear(),
  );

  if (month) month.total += Number(p.amount || 0);
});

if (typeof Chart !== "undefined") {
  new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: "Revenue",
          data: months.map((m) => m.total),
          borderColor: "#7554d8",
          backgroundColor: "rgba(117,84,216,0.12)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "₹" + value,
          },
        },
      },
    },
  });
}

function logout() {
  alert(
    "Logout functionality will be connected after authentication is implemented.",
  );
}
