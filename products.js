
// Get saved products from localStorage
let products = JSON.parse(
    localStorage.getItem("products")
) || [];

// Get HTML elements
const addProductBtn = document.getElementById("addProductBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");
const productForm = document.getElementById("productForm");

const productList = document.getElementById("productList");
const productSearch = document.getElementById("productSearch");

// Show form
addProductBtn.addEventListener("click", () => {
    productForm.style.display = "block";
});

// Hide form
cancelProductBtn.addEventListener("click", () => {
    productForm.style.display = "none";
});

// Save product
saveProductBtn.addEventListener("click", () => {

    const name = document.getElementById("productName").value.trim();
    const type = document.getElementById("productType").value;

    const salesPrice = document.getElementById("salesPrice").value;
    const costPrice = document.getElementById("costPrice").value;

    const variantName = document.getElementById("variantName").value.trim();
    const variantPrice = document.getElementById("variantPrice").value;

    const notes = document.getElementById("productNotes").value.trim();

    // Validate required fields
    if (!name || !type || salesPrice === "" || costPrice === "") {
        alert("Please fill all required fields!");
        return;
    }

    if (
        !Number.isFinite(Number(salesPrice)) ||
        !Number.isFinite(Number(costPrice)) ||
        Number(salesPrice) < 0 ||
        Number(costPrice) < 0
    ) {
        alert("Please enter valid prices!");
        return;
    }

    // Variant fields must be filled together
    if (
        (variantName && variantPrice === "") ||
        (!variantName && variantPrice !== "")
    ) {
        alert("Please enter both variant name and additional price!");
        return;
    }

    if (
        variantPrice !== "" &&
        (!Number.isFinite(Number(variantPrice)) || Number(variantPrice) < 0)
    ) {
        alert("Please enter a valid variant price!");
        return;
    }

    // Create product object
    const product = {
        id: Date.now(),
        name: name,
        type: type,
        salesPrice: Number(salesPrice),
        costPrice: Number(costPrice),
        variant: variantName ? {
            name: variantName,
            additionalPrice: Number(variantPrice)
        } : null,
        notes: notes
    };

    // Add product
    products.push(product);

    // Save to browser storage
    localStorage.setItem("products", JSON.stringify(products));

    // Clear form
    productForm.querySelectorAll("input, select, textarea").forEach(field => {
        field.value = "";
    });

    productForm.style.display = "none";

    displayProducts();

    alert("Product added successfully!");
});

// Display products
function displayProducts(searchValue = "") {

    productList.innerHTML = "";

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue) ||
        product.type.toLowerCase().includes(searchValue)
    );

    filteredProducts.forEach(product => {

        const row = document.createElement("tr");

        const variantText = product.variant
            ? `${product.variant.name} (+₹${product.variant.additionalPrice})`
            : "No Variant";

        const values = [
            product.name,
            product.type,
            "₹" + product.salesPrice,
            "₹" + product.costPrice,
            variantText
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Delete button
        const actionCell = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "product-delete";

        deleteBtn.addEventListener("click", () => {

            products = products.filter(item => item.id !== product.id);

            localStorage.setItem("products", JSON.stringify(products));

            displayProducts(productSearch.value.toLowerCase());
        });

        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        productList.appendChild(row);
    });

    document.getElementById("totalProducts").textContent =
        "Total Products: " + products.length;
}

// Search products
productSearch.addEventListener("input", () => {
    displayProducts(productSearch.value.toLowerCase());
});

// Initial display
displayProducts();
