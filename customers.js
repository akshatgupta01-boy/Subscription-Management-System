
let customers = JSON.parse(localStorage.getItem("customers")) || [];

const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("customerForm");
const search = document.getElementById("search");

// Open form
addBtn.addEventListener("click", () => {
    form.style.display = "block";
});

// Close form
cancelBtn.addEventListener("click", () => {
    form.style.display = "none";
});

// Save customer
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
        customer => customer.email.toLowerCase() === email.toLowerCase()
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
        company
    });

    localStorage.setItem("customers", JSON.stringify(customers));

    document.querySelectorAll(".customer-form input").forEach(input => {
        input.value = "";
    });

    form.style.display = "none";

    displayCustomers();
});

// Display customers and update statistics
function displayCustomers() {
    const list = document.getElementById("customerList");
    const searchValue = search.value.toLowerCase();

    list.innerHTML = "";

    // Filter customers
    const filteredCustomers = customers.filter(customer =>
        [
            customer.name,
            customer.email,
            customer.phone,
            customer.company
        ].some(value => (value || "").toLowerCase().includes(searchValue))
    );

    // Display filtered customers
    filteredCustomers.forEach(customer => {
        const row = document.createElement("tr");

        [
            customer.name,
            customer.email,
            customer.phone,
            customer.company || "—"
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            customers = customers.filter(
                item => item.id !== customer.id
            );

            localStorage.setItem("customers", JSON.stringify(customers));
            displayCustomers();
        });

        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        list.appendChild(row);
    });

    // Total customer count
    document.getElementById("totalCustomers").textContent =
        "Total Customers: " + customers.length;

    document.getElementById("customerStatTotal").textContent =
        customers.length;

    // Count unique companies (ignore blank company names)
    const uniqueCompanies = new Set(
        customers
            .map(customer => (customer.company || "").trim().toLowerCase())
            .filter(company => company !== "")
    );

    document.getElementById("customerStatCompanies").textContent =
        uniqueCompanies.size;
}

// Search customers
search.addEventListener("input", displayCustomers);

// Initial display
displayCustomers();
