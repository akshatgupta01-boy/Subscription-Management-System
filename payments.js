let payments = JSON.parse(localStorage.getItem("payments")) || [];

const paymentList = document.getElementById("paymentList");
const paymentSearch = document.getElementById("paymentSearch");
const methodFilter = document.getElementById("methodFilter");

function money(amount) {
  return "₹" + Number(amount).toFixed(2);
}

// Display payment history
function displayPayments() {
  paymentList.innerHTML = "";

  const search = paymentSearch.value.toLowerCase();
  const method = methodFilter.value;

  const filtered = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(search) ||
      payment.invoiceId.toLowerCase().includes(search) ||
      payment.customerName.toLowerCase().includes(search);

    const matchesMethod = !method || payment.method === method;

    return matchesSearch && matchesMethod;
  });

  filtered.forEach((payment) => {
    const row = document.createElement("tr");

    const values = [
      payment.id,
      payment.invoiceId,
      payment.customerName,
      money(payment.amount),
      payment.method,
      payment.paymentDate,
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      row.appendChild(cell);
    });

    const statusCell = document.createElement("td");

    const badge = document.createElement("span");
    badge.className = "payment-status";
    badge.textContent = "Successful";

    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    paymentList.appendChild(row);
  });

  document.getElementById("noPayments").textContent =
    filtered.length === 0 ? "No payment records found." : "";

  // Statistics
  const total = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  document.getElementById("totalPayments").textContent = payments.length;

  document.getElementById("totalCollected").textContent = money(total);

  document.getElementById("upiPayments").textContent = payments.filter(
    (p) => p.method === "UPI",
  ).length;

  document.getElementById("cardPayments").textContent = payments.filter(
    (p) => p.method === "Card",
  ).length;
}

// Search
paymentSearch.addEventListener("input", displayPayments);

// Filter
methodFilter.addEventListener("change", displayPayments);

// Initial load
displayPayments();
