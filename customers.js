let customers = JSON.parse(localStorage.getItem("customers")) || [];

const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("customerForm");

addBtn.addEventListener("click", () => {
  form.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  form.style.display = "none";
});

saveBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const company = document.getElementById("company").value.trim();

  if (!name || !email || !phone) {
    alert("Please fill all required fields!");
    return;
  }

  const exists = customers.some(
    (customer) => customer.email.toLowerCase() === email.toLowerCase(),
  );

  if (exists) {
    alert("Customer email already exists!");
    return;
  }

  customers.push({
    id: Date.now(),
    name,
    email,
    phone,
    company,
  });

  localStorage.setItem("customers", JSON.stringify(customers));

  document.querySelectorAll(".customer-form input").forEach((input) => {
    input.value = "";
  });

  form.style.display = "none";

  displayCustomers();
});

function displayCustomers() {
  const list = document.getElementById("customerList");

  list.innerHTML = "";

  customers.forEach((customer) => {
    const row = document.createElement("tr");

    [customer.name, customer.email, customer.phone, customer.company].forEach(
      (value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      },
    );

    const actionCell = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      customers = customers.filter((item) => item.id !== customer.id);

      localStorage.setItem("customers", JSON.stringify(customers));
      displayCustomers();
    });

    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    list.appendChild(row);
  });

  document.getElementById("totalCustomers").textContent =
    "Total Customers: " + customers.length;
}

// Search customers
document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const rows = document.querySelectorAll("#customerList tr");

  rows.forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(value)
      ? ""
      : "none";
  });
});

displayCustomers();
