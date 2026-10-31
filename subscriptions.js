// Load saved data
let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

let customers = JSON.parse(localStorage.getItem("customers")) || [];

let plans = JSON.parse(localStorage.getItem("plans")) || [];

// HTML elements
const form = document.getElementById("subscriptionForm");
const customerSelect = document.getElementById("customerSelect");
const planSelect = document.getElementById("planSelect");
const subscriptionList = document.getElementById("subscriptionList");

// Today's date in local timezone
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Format currency
function money(amount) {
  return "₹" + Number(amount).toFixed(2);
}

// Calculate expiry date
function calculateExpiry(startDate, billing) {
  const date = new Date(startDate + "T12:00:00");

  switch (billing) {
    case "Daily":
      date.setDate(date.getDate() + 1);
      break;

    case "Weekly":
      date.setDate(date.getDate() + 7);
      break;

    case "Monthly": {
      const day = date.getDate();
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
      ).getDate();
      date.setDate(Math.min(day, lastDay));
      break;
    }

    case "Yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Load customers into dropdown
function loadCustomers() {
  customers = JSON.parse(localStorage.getItem("customers")) || [];

  customerSelect.innerHTML = '<option value="">Select Customer</option>';

  customers.forEach((customer) => {
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = customer.name;
    customerSelect.appendChild(option);
  });
}

// Load plans into dropdown
function loadPlans() {
  plans = JSON.parse(localStorage.getItem("plans")) || [];

  planSelect.innerHTML = '<option value="">Select Plan</option>';

  plans.forEach((plan) => {
    const option = document.createElement("option");
    option.value = plan.id;
    option.textContent = `${plan.name} - ${money(plan.price)}`;

    planSelect.appendChild(option);
  });
}

// Get selected plan
function getSelectedPlan() {
  return plans.find((plan) => String(plan.id) === planSelect.value);
}

// Calculate and display price preview
function updatePreview() {
  const plan = getSelectedPlan();

  const quantity = Number(
    document.getElementById("subscriptionQuantity").value,
  );

  const tax = Number(document.getElementById("subscriptionTax").value);

  const start = document.getElementById("subscriptionStart").value;

  if (
    !plan ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    !Number.isFinite(tax) ||
    tax < 0 ||
    tax > 100
  ) {
    document.getElementById("unitPrice").textContent = "₹0";
    document.getElementById("subtotal").textContent = "₹0";
    document.getElementById("taxAmount").textContent = "₹0";
    document.getElementById("grandTotal").textContent = "₹0";
    document.getElementById("expiryPreview").textContent = "-";

    return;
  }

  const subtotal = plan.price * quantity;
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  document.getElementById("unitPrice").textContent = money(plan.price);

  document.getElementById("subtotal").textContent = money(subtotal);

  document.getElementById("taxAmount").textContent = money(taxAmount);

  document.getElementById("grandTotal").textContent = money(total);

  document.getElementById("expiryPreview").textContent = start
    ? calculateExpiry(start, plan.billing)
    : "-";
}

// Open form
document.getElementById("addSubscriptionBtn").addEventListener("click", () => {
  loadCustomers();
  loadPlans();

  if (customers.length === 0) {
    alert("Please add a customer first!");
    return;
  }

  if (plans.length === 0) {
    alert("Please create a plan first!");
    return;
  }

  form.style.display = "block";

  document.getElementById("subscriptionStart").value = getToday();

  updatePreview();
});

// Cancel form
document
  .getElementById("cancelSubscriptionBtn")
  .addEventListener("click", () => {
    form.style.display = "none";
  });

// Update price when input changes
[
  "planSelect",
  "subscriptionQuantity",
  "subscriptionTax",
  "subscriptionStart",
].forEach((id) => {
  document.getElementById(id).addEventListener("input", updatePreview);
});

// Save subscription
document.getElementById("saveSubscriptionBtn").addEventListener("click", () => {
  const customer = customers.find(
    (item) => String(item.id) === customerSelect.value,
  );

  const plan = getSelectedPlan();

  const startDate = document.getElementById("subscriptionStart").value;

  const quantity = Number(
    document.getElementById("subscriptionQuantity").value,
  );

  const tax = Number(document.getElementById("subscriptionTax").value);

  const paymentTerms = document.getElementById("paymentTerms").value;

  if (!customer || !plan || !startDate) {
    alert("Please select a customer, plan and start date!");
    return;
  }

  if (!Number.isInteger(quantity) || quantity < plan.minQuantity) {
    alert(`Minimum quantity for this plan is ${plan.minQuantity}`);
    return;
  }

  if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
    alert("Tax must be between 0 and 100!");
    return;
  }

  if (startDate < plan.startDate || startDate > plan.endDate) {
    alert("The selected start date is outside the plan availability period!");
    return;
  }

  // Check plan availability
  const currentPlans = JSON.parse(localStorage.getItem("plans")) || [];

  const latestPlan = currentPlans.find(
    (item) => String(item.id) === String(plan.id),
  );

  if (!latestPlan) {
    alert("This plan no longer exists!");
    return;
  }

  const expiryDate = calculateExpiry(startDate, plan.billing);

  const subtotal = plan.price * quantity;
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  const subscription = {
    id: "SUB-" + Date.now(),

    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,

    planId: plan.id,
    planName: plan.name,
    billing: plan.billing,

    startDate: startDate,
    expiryDate: expiryDate,

    quantity: quantity,
    unitPrice: plan.price,

    paymentTerms: paymentTerms,

    taxPercentage: tax,
    subtotal: subtotal,
    taxAmount: taxAmount,
    total: total,

    status: "Draft",

    rules: plan.rules || {},

    createdAt: new Date().toISOString(),
  };

  subscriptions.push(subscription);

  localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

  // Reset form
  form.querySelectorAll("input, select").forEach((field) => {
    field.value = "";
  });

  document.getElementById("subscriptionQuantity").value = 1;
  document.getElementById("subscriptionTax").value = 18;

  form.style.display = "none";

  displaySubscriptions();

  alert("Subscription created successfully!");
});

// Change subscription status
function changeStatus(id, action) {
  const subscription = subscriptions.find((item) => item.id === id);

  if (!subscription) return;

  if (action === "next") {
    const transitions = {
      Draft: "Quotation",
      Quotation: "Confirmed",
      Confirmed: "Active",
    };

    const nextStatus = transitions[subscription.status];

    if (!nextStatus) return;

    if (nextStatus === "Active" && subscription.expiryDate <= getToday()) {
      alert("This subscription has already expired!");
      return;
    }

    subscription.status = nextStatus;
  } else if (action === "pause") {
    if (subscription.status !== "Active") return;

    if (subscription.rules.allowPause === false) {
      alert("Pause is not allowed for this plan!");
      return;
    }

    subscription.status = "Paused";
  } else if (action === "resume") {
    if (subscription.status !== "Paused") return;

    if (subscription.expiryDate <= getToday()) {
      subscription.status = "Closed";
      alert("Subscription has expired and cannot be resumed.");
    } else {
      subscription.status = "Active";
    }
  } else if (action === "close") {
    if (!["Active", "Paused"].includes(subscription.status)) return;

    const expired = subscription.expiryDate <= getToday();

    if (!expired && subscription.rules.allowEarlyClose === false) {
      alert("Early closure is not allowed for this plan!");
      return;
    }

    if (!confirm("Are you sure you want to close this subscription?")) {
      return;
    }

    subscription.status = "Closed";
  }

  localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

  displaySubscriptions();
}

// Display subscriptions
function displaySubscriptions(searchValue = "") {
  subscriptionList.innerHTML = "";

  // Apply automatic expiry
  subscriptions.forEach((subscription) => {
    if (
      subscription.status === "Active" &&
      subscription.expiryDate <= getToday()
    ) {
      subscription.status = "Closed";
    }
  });

  localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

  const filtered = subscriptions.filter(
    (subscription) =>
      subscription.id.toLowerCase().includes(searchValue) ||
      subscription.customerName.toLowerCase().includes(searchValue) ||
      subscription.planName.toLowerCase().includes(searchValue) ||
      subscription.status.toLowerCase().includes(searchValue),
  );

  filtered.forEach((subscription) => {
    const row = document.createElement("tr");

    const values = [
      subscription.id,
      subscription.customerName,
      subscription.planName,
      subscription.startDate,
      subscription.expiryDate,
      money(subscription.total),
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      row.appendChild(cell);
    });

    // Status
    const statusCell = document.createElement("td");
    const badge = document.createElement("span");

    badge.textContent = subscription.status;
    badge.className = "status-badge";

    if (subscription.status === "Active") {
      badge.classList.add("status-active");
    } else if (subscription.status === "Paused") {
      badge.classList.add("status-paused");
    } else if (subscription.status === "Closed") {
      badge.classList.add("status-closed");
    }

    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    // Actions
    const actionCell = document.createElement("td");
    const actions = document.createElement("div");

    actions.className = "subscription-action";

    function addButton(label, action, className) {
      const button = document.createElement("button");

      button.textContent = label;
      button.className = className;

      button.addEventListener("click", () => {
        changeStatus(subscription.id, action);
      });

      actions.appendChild(button);
    }

    if (subscription.status === "Draft") {
      addButton("Quotation", "next", "action-next");
    } else if (subscription.status === "Quotation") {
      addButton("Confirm", "next", "action-next");
    } else if (subscription.status === "Confirmed") {
      addButton("Activate", "next", "action-next");
    } else if (subscription.status === "Active") {
      addButton("Pause", "pause", "action-pause");

      if (
        subscription.rules.allowEarlyClose !== false ||
        subscription.expiryDate <= getToday()
      ) {
        addButton("Close", "close", "action-close");
      }
    } else if (subscription.status === "Paused") {
      addButton("Resume", "resume", "action-next");

      if (
        subscription.rules.allowEarlyClose !== false ||
        subscription.expiryDate <= getToday()
      ) {
        addButton("Close", "close", "action-close");
      }
    }

    // Delete
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-delete";

    deleteBtn.addEventListener("click", () => {
      if (!confirm("Delete this subscription permanently?")) {
        return;
      }

      subscriptions = subscriptions.filter(
        (item) => item.id !== subscription.id,
      );

      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

      displaySubscriptions(
        document.getElementById("subscriptionSearch").value.toLowerCase(),
      );
    });

    actions.appendChild(deleteBtn);

    actionCell.appendChild(actions);
    row.appendChild(actionCell);

    subscriptionList.appendChild(row);
  });

  document.getElementById("totalSubscriptions").textContent =
    "Total Subscriptions: " + subscriptions.length;
}

// Search subscriptions
document
  .getElementById("subscriptionSearch")
  .addEventListener("input", function () {
    displaySubscriptions(this.value.toLowerCase());
  });

// Initial display
loadCustomers();
loadPlans();
displaySubscriptions();
