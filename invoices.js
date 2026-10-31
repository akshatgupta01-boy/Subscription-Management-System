// Load saved data
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

let payments = JSON.parse(localStorage.getItem("payments")) || [];

// Selected invoice for payment
let selectedInvoiceId = null;

// HTML elements
const invoiceList = document.getElementById("invoiceList");
const paymentModal = document.getElementById("paymentModal");

// Today's date
function today() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

// Format currency
function money(amount) {
  return "₹" + Number(amount).toFixed(2);
}

// Calculate due date
function calculateDueDate(invoiceDate, terms) {
  const date = new Date(invoiceDate + "T12:00:00");

  if (terms === "15 Days") {
    date.setDate(date.getDate() + 15);
  } else if (terms === "30 Days") {
    date.setDate(date.getDate() + 30);
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

// Save data
function saveInvoices() {
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

function savePayments() {
  localStorage.setItem("payments", JSON.stringify(payments));
}

// Generate invoice
document.getElementById("generateInvoiceBtn").addEventListener("click", () => {
  subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

  const eligible = subscriptions.filter((subscription) =>
    ["Active", "Confirmed"].includes(subscription.status),
  );

  if (eligible.length === 0) {
    alert("No confirmed or active subscriptions available!");
    return;
  }

  const available = eligible.filter(
    (subscription) =>
      !invoices.some((invoice) => invoice.subscriptionId === subscription.id),
  );

  if (available.length === 0) {
    alert("Invoices have already been generated for these subscriptions!");
    return;
  }

  // Choose a subscription
  const choices = available
    .map(
      (subscription, index) =>
        `${index + 1}. ${subscription.customerName} - ${subscription.planName} (${subscription.id})`,
    )
    .join("\n");

  const answer = prompt("Select subscription number:\n\n" + choices);

  if (answer === null) return;

  const selectedIndex = Number(answer) - 1;

  if (
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= available.length
  ) {
    alert("Invalid selection!");
    return;
  }

  const subscription = available[selectedIndex];

  const invoiceDate = today();

  const invoice = {
    id: "INV-" + Date.now(),

    subscriptionId: subscription.id,

    customerName: subscription.customerName,
    customerEmail: subscription.customerEmail,

    planName: subscription.planName,

    invoiceDate: invoiceDate,

    dueDate: calculateDueDate(invoiceDate, subscription.paymentTerms),

    subtotal: subscription.subtotal,
    taxAmount: subscription.taxAmount,
    total: subscription.total,

    paidAmount: 0,

    status: "Pending",

    createdAt: new Date().toISOString(),
  };

  invoices.push(invoice);

  saveInvoices();
  displayInvoices();

  alert("Invoice generated successfully!\n" + invoice.id);
});

// Open payment modal
function openPaymentModal(invoice) {
  selectedInvoiceId = invoice.id;

  const remaining = invoice.total - invoice.paidAmount;

  document.getElementById("paymentInvoiceInfo").textContent =
    `Invoice: ${invoice.id} | Remaining: ${money(remaining)}`;

  document.getElementById("paymentAmount").value = "";
  document.getElementById("paymentAmount").max = remaining;

  paymentModal.style.display = "flex";
}

// Cancel payment
document.getElementById("cancelPaymentBtn").addEventListener("click", () => {
  paymentModal.style.display = "none";
  selectedInvoiceId = null;
});

// Save payment
document.getElementById("savePaymentBtn").addEventListener("click", () => {
  const invoice = invoices.find((item) => item.id === selectedInvoiceId);

  if (!invoice) return;

  const amount = Number(document.getElementById("paymentAmount").value);

  const remaining = Number((invoice.total - invoice.paidAmount).toFixed(2));

  if (!Number.isFinite(amount) || amount <= 0 || amount > remaining) {
    alert(`Enter an amount between ₹0.01 and ${money(remaining)}`);
    return;
  }

  const payment = {
    id: "PAY-" + Date.now(),

    invoiceId: invoice.id,

    customerName: invoice.customerName,

    amount: amount,

    method: document.getElementById("paymentMethod").value,

    paymentDate: today(),
  };

  payments.push(payment);

  invoice.paidAmount = Number((invoice.paidAmount + amount).toFixed(2));

  if (invoice.paidAmount >= invoice.total) {
    invoice.status = "Paid";
  } else {
    invoice.status = "Partially Paid";
  }

  savePayments();
  saveInvoices();

  paymentModal.style.display = "none";
  selectedInvoiceId = null;

  displayInvoices();

  alert("Payment recorded successfully!");
});

// Print invoice
function printInvoice(invoice) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to print invoices.");
    return;
  }

  const remaining = invoice.total - invoice.paidAmount;

  const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${invoice.id}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #333;
                }

                h1 { color: #6554c0; }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 30px;
                }

                th, td {
                    padding: 14px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }

                .total {
                    text-align: right;
                    margin-top: 30px;
                    line-height: 2;
                }
            </style>
        </head>
        <body>
            <h1>Brightloop</h1>
            <h2>INVOICE</h2>

            <p><strong>Invoice Number:</strong> ${invoice.id}</p>
            <p><strong>Customer:</strong> ${invoice.customerName}</p>
            <p><strong>Email:</strong> ${invoice.customerEmail}</p>
            <p><strong>Invoice Date:</strong> ${invoice.invoiceDate}</p>
            <p><strong>Due Date:</strong> ${invoice.dueDate}</p>

            <table>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
                <tr>
                    <td>${invoice.planName}</td>
                    <td>${money(invoice.subtotal)}</td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>${money(invoice.taxAmount)}</td>
                </tr>
            </table>

            <div class="total">
                <h3>Total: ${money(invoice.total)}</h3>
                <p>Paid: ${money(invoice.paidAmount)}</p>
                <h3>Balance Due: ${money(remaining)}</h3>
                <p>Status: ${invoice.status}</p>
            </div>
        </body>
        </html>
    `;

  printWindow.document.write(content);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.print();
  };
}

// Delete invoice
function deleteInvoice(id) {
  if (!confirm("Delete this invoice and its payment records?")) {
    return;
  }

  invoices = invoices.filter((invoice) => invoice.id !== id);

  payments = payments.filter((payment) => payment.invoiceId !== id);

  saveInvoices();
  savePayments();

  displayInvoices();
}

// Display invoices
function displayInvoices(searchValue = "") {
  invoiceList.innerHTML = "";

  const filtered = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchValue) ||
      invoice.customerName.toLowerCase().includes(searchValue) ||
      invoice.status.toLowerCase().includes(searchValue),
  );

  filtered.forEach((invoice) => {
    const row = document.createElement("tr");

    const values = [
      invoice.id,
      invoice.customerName,
      invoice.invoiceDate,
      invoice.dueDate,
      money(invoice.total),
      money(invoice.paidAmount),
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      row.appendChild(cell);
    });

    // Status
    const statusCell = document.createElement("td");
    const badge = document.createElement("span");

    badge.textContent = invoice.status;
    badge.className = "invoice-status";

    if (invoice.status === "Paid") {
      badge.classList.add("invoice-paid");
    } else if (invoice.status === "Partially Paid") {
      badge.classList.add("invoice-partial");
    } else {
      badge.classList.add("invoice-pending");
    }

    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    // Actions
    const actionCell = document.createElement("td");
    const actions = document.createElement("div");

    actions.className = "invoice-action";

    if (invoice.status !== "Paid") {
      const payBtn = document.createElement("button");

      payBtn.textContent = "Record Payment";
      payBtn.className = "invoice-pay";

      payBtn.addEventListener("click", () => {
        openPaymentModal(invoice);
      });

      actions.appendChild(payBtn);
    }

    const printBtn = document.createElement("button");

    printBtn.textContent = "Print";
    printBtn.className = "invoice-print";

    printBtn.addEventListener("click", () => {
      printInvoice(invoice);
    });

    actions.appendChild(printBtn);

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";
    deleteBtn.className = "invoice-delete";

    deleteBtn.addEventListener("click", () => {
      deleteInvoice(invoice.id);
    });

    actions.appendChild(deleteBtn);

    actionCell.appendChild(actions);
    row.appendChild(actionCell);

    invoiceList.appendChild(row);
  });

  // Statistics
  const paid = invoices.filter((invoice) => invoice.status === "Paid").length;

  const pending = invoices.filter(
    (invoice) => invoice.status === "Pending",
  ).length;

  const outstanding = invoices.reduce(
    (sum, invoice) => sum + invoice.total - invoice.paidAmount,
    0,
  );

  document.getElementById("totalInvoices").textContent = invoices.length;

  document.getElementById("paidInvoices").textContent = paid;

  document.getElementById("pendingInvoices").textContent = pending;

  document.getElementById("outstandingAmount").textContent = money(outstanding);
}

// Search
document.getElementById("invoiceSearch").addEventListener("input", function () {
  displayInvoices(this.value.toLowerCase());
});

// Initial display
displayInvoices();
