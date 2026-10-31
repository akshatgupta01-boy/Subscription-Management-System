const discountForm = document.getElementById("discountForm");

let discounts = JSON.parse(localStorage.getItem("discounts")) || [];

function saveDiscounts() {
  localStorage.setItem("discounts", JSON.stringify(discounts));
}

function renderDiscounts() {
  const table = document.getElementById("discountTable");
  const search = document.getElementById("discountSearch").value.toLowerCase();

  table.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  const filtered = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(search) ||
      d.name.toLowerCase().includes(search),
  );

  filtered.forEach((d) => {
    let status = "Active";

    if (today < d.validFrom || today > d.validUntil) {
      status = "Expired / Upcoming";
    }

    if (d.usageLimit > 0 && d.used >= d.usageLimit) {
      status = "Limit Reached";
    }

    const row = document.createElement("tr");

    [
      d.code,
      d.name,
      d.type,
      d.type === "Percentage" ? d.value + "%" : "₹" + d.value,
      d.validFrom + " to " + d.validUntil,
      d.used + " / " + (d.usageLimit || "Unlimited"),
      status,
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
      discounts = discounts.filter((item) => item.id !== d.id);
      saveDiscounts();
      renderDiscounts();
    };

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    table.appendChild(row);
  });

  document.getElementById("noDiscounts").style.display =
    filtered.length === 0 ? "block" : "none";

  document.getElementById("totalDiscounts").textContent = discounts.length;

  document.getElementById("activeDiscounts").textContent = discounts.filter(
    (d) =>
      today >= d.validFrom &&
      today <= d.validUntil &&
      (d.usageLimit === 0 || d.used < d.usageLimit),
  ).length;

  document.getElementById("totalUsage").textContent = discounts.reduce(
    (sum, d) => sum + d.used,
    0,
  );
}

discountForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const code = document.getElementById("couponCode").value.trim().toUpperCase();
  const name = document.getElementById("discountName").value.trim();
  const type = document.getElementById("discountType").value;
  const value = Number(document.getElementById("discountValue").value);
  const minimumOrder = Number(document.getElementById("minimumOrder").value);
  const validFrom = document.getElementById("validFrom").value;
  const validUntil = document.getElementById("validUntil").value;
  const usageLimit = Number(document.getElementById("usageLimit").value);

  if (discounts.some((d) => d.code === code)) {
    alert("This coupon code already exists!");
    return;
  }

  if (value <= 0 || minimumOrder < 0 || usageLimit < 0) {
    alert("Please enter valid discount values.");
    return;
  }

  if (type === "Percentage" && value > 100) {
    alert("Percentage discount cannot exceed 100%.");
    return;
  }

  if (validUntil < validFrom) {
    alert("Valid Until date must be after Valid From date.");
    return;
  }

  if (!code || !name || !type || !validFrom || !validUntil) {
    alert("Please fill all required fields.");
    return;
  }

  discounts.push({
    id: Date.now(),
    code,
    name,
    type,
    value,
    minimumOrder,
    validFrom,
    validUntil,
    usageLimit,
    used: 0,
  });

  saveDiscounts();
  discountForm.reset();

  document.getElementById("minimumOrder").value = 0;
  document.getElementById("usageLimit").value = 0;

  renderDiscounts();

  alert("Discount created successfully!");
});

document
  .getElementById("discountSearch")
  .addEventListener("input", renderDiscounts);

renderDiscounts();
