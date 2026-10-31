console.log("========== BRIGHTLOOP DATA ==========");

const keys = [
  "customers",
  "products",
  "plans",
  "subscriptions",
  "invoices",
  "payments"
];

keys.forEach((key) => {
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  console.log(key + ":", data);
});

console.log("=====================================");