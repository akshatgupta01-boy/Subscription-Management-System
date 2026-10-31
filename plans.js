// Load saved data
let plans = JSON.parse(localStorage.getItem("plans")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

// Get elements
const planForm = document.getElementById("planForm");
const addPlanBtn = document.getElementById("addPlanBtn");
const savePlanBtn = document.getElementById("savePlanBtn");
const cancelPlanBtn = document.getElementById("cancelPlanBtn");
const planProduct = document.getElementById("planProduct");
const planList = document.getElementById("planList");

// Load products into dropdown
function loadProducts() {
  planProduct.innerHTML = '<option value="">Select Product</option>';

  products.forEach((product) => {
    const option = document.createElement("option");

    option.value = product.id;
    option.textContent = product.name;

    planProduct.appendChild(option);
  });
}

// Show form
addPlanBtn.addEventListener("click", () => {
  products = JSON.parse(localStorage.getItem("products")) || [];
  loadProducts();

  if (products.length === 0) {
    alert("Please create a product first!");
    return;
  }

  planForm.style.display = "block";
});

// Hide form
cancelPlanBtn.addEventListener("click", () => {
  planForm.style.display = "none";
});

// Save plan
savePlanBtn.addEventListener("click", () => {
  const name = document.getElementById("planName").value.trim();
  const productId = planProduct.value;
  const price = document.getElementById("planPrice").value;
  const billing = document.getElementById("billingCycle").value;
  const minQuantity = document.getElementById("minQuantity").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Validate required fields
  if (
    !name ||
    !productId ||
    price === "" ||
    !billing ||
    minQuantity === "" ||
    !startDate ||
    !endDate
  ) {
    alert("Please fill all required fields!");
    return;
  }

  // Validate numbers
  if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    alert("Enter a valid plan price!");
    return;
  }

  if (!Number.isInteger(Number(minQuantity)) || Number(minQuantity) < 1) {
    alert("Minimum quantity must be at least 1!");
    return;
  }

  // Validate dates
  if (endDate < startDate) {
    alert("End date cannot be before start date!");
    return;
  }

  const selectedProduct = products.find(
    (product) => String(product.id) === productId,
  );

  if (!selectedProduct) {
    alert("Selected product was not found. Please refresh and try again.");
    return;
  }

  // Create plan
  const plan = {
    id: Date.now(),
    name: name,
    productId: productId,
    productName: selectedProduct.name,
    price: Number(price),
    billing: billing,
    minQuantity: Number(minQuantity),
    startDate: startDate,
    endDate: endDate,

    rules: {
      autoClose: document.getElementById("autoClose").checked,
      allowEarlyClose: document.getElementById("allowEarlyClose").checked,
      allowPause: document.getElementById("allowPause").checked,
      allowRenew: document.getElementById("allowRenew").checked,
    },
  };

  plans.push(plan);

  localStorage.setItem("plans", JSON.stringify(plans));

  // Clear form
  planForm.querySelectorAll("input, select").forEach((field) => {
    if (field.type === "checkbox") {
      field.checked = field.id !== "autoClose";
    } else {
      field.value = "";
    }
  });

  document.getElementById("minQuantity").value = 1;

  planForm.style.display = "none";

  displayPlans();

  alert("Plan created successfully!");
});

// Display plans
function displayPlans(searchValue = "") {
  planList.innerHTML = "";

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchValue) ||
      plan.productName.toLowerCase().includes(searchValue) ||
      plan.billing.toLowerCase().includes(searchValue),
  );

  filteredPlans.forEach((plan) => {
    const row = document.createElement("tr");

    const values = [
      plan.name,
      plan.productName,
      "₹" + plan.price,
      plan.billing,
      plan.minQuantity,
      plan.startDate + " to " + plan.endDate,
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    // Delete button
    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";
    deleteBtn.className = "plan-delete";

    deleteBtn.addEventListener("click", () => {
      plans = plans.filter((item) => item.id !== plan.id);

      localStorage.setItem("plans", JSON.stringify(plans));

      displayPlans(planSearch.value.toLowerCase());
    });

    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    planList.appendChild(row);
  });

  document.getElementById("totalPlans").textContent =
    "Total Plans: " + plans.length;
}

// Search plans
const planSearch = document.getElementById("planSearch");

planSearch.addEventListener("input", () => {
  displayPlans(planSearch.value.toLowerCase());
});

// Initial load
loadProducts();
displayPlans();
