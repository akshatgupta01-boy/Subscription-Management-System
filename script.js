// Highlight the selected sidebar menu
const menuLinks = document.querySelectorAll(".sidebar nav a");

menuLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    menuLinks.forEach((item) => {
      item.classList.remove("active");
    });

    this.classList.add("active");
  });
});

console.log("Brightloop Subscription Management System loaded!");
