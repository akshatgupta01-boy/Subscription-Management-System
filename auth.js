const authForm = document.getElementById("authForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const switchButton = document.getElementById("switchButton");

const nameField = document.getElementById("nameField");
const confirmField = document.getElementById("confirmField");
const loginOptions = document.getElementById("loginOptions");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const submitBtn = document.getElementById("submitBtn");
const switchText = document.getElementById("switchText");
const message = document.getElementById("message");

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

let isRegister = false;

// Switch between Login and Register
function setMode(registerMode) {
  isRegister = registerMode;
  authForm.reset();
  message.textContent = "";
  message.className = "message";

  loginTab.classList.toggle("active", !isRegister);
  registerTab.classList.toggle("active", isRegister);

  nameField.hidden = !isRegister;
  confirmField.hidden = !isRegister;
  loginOptions.hidden = isRegister;

  formTitle.textContent = isRegister ? "Create an account" : "Welcome back";

  formSubtitle.textContent = isRegister
    ? "Enter your details to create your Brightloop account."
    : "Enter your details to access your account.";

  submitBtn.textContent = isRegister ? "Create account" : "Login to account";

  switchText.innerHTML = isRegister
    ? 'Already have an account? <button type="button" id="switchButton">Login</button>'
    : 'Don\'t have an account? <button type="button" id="switchButton">Create account</button>';

  document.getElementById("switchButton").addEventListener("click", () => {
    setMode(!isRegister);
  });

  togglePassword.textContent = "Show";
  password.type = "password";
}

loginTab.addEventListener("click", () => setMode(false));
registerTab.addEventListener("click", () => setMode(true));

switchButton.addEventListener("click", () => setMode(true));

// Show / Hide password
togglePassword.addEventListener("click", () => {
  const hidden = password.type === "password";

  password.type = hidden ? "text" : "password";
  togglePassword.textContent = hidden ? "Hide" : "Show";
});

// Display messages
function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}

// Get saved users
function getUsers() {
  return JSON.parse(localStorage.getItem("brightloopUsers")) || [];
}

// Register and Login
authForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const pass = password.value;

  const users = getUsers();

  if (isRegister) {
    const name = document.getElementById("name").value.trim();
    const confirmPass = document.getElementById("confirmPassword").value;

    if (!name) {
      return showMessage("Please enter your full name.", "error");
    }

    if (pass.length < 6) {
      return showMessage(
        "Password must contain at least 6 characters.",
        "error",
      );
    }

    if (pass !== confirmPass) {
      return showMessage("Passwords do not match.", "error");
    }

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return showMessage("This email is already registered.", "error");
    }

    users.push({
      name: name,
      email: email,
      password: pass,
    });

    localStorage.setItem("brightloopUsers", JSON.stringify(users));

    showMessage("Account created! Please login.", "success");

    setTimeout(() => setMode(false), 1000);
  } else {
    const user = users.find(
      (user) => user.email === email && user.password === pass,
    );

    if (!user) {
      return showMessage("Invalid email or password.", "error");
    }

    localStorage.setItem(
      "brightloopCurrentUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
      }),
    );

    showMessage("Login successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 700);
  }
});
