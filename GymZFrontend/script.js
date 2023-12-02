//Global variables
var video = document.getElementById("example");
var videoSource = document.getElementById("vid-src");

//Hamburger menu function
function hamburger() {
  var menu = document.getElementById("menu-links");
  var logo = document.getElementById("gymz-logo");
  if (menu.style.display === "block" && logo.style.display === "none") {
    menu.style.display = "none";
    logo.style.display = "block";
  } else {
    menu.style.display = "block";
    logo.style.display = "none";
  }
}

//Function to display the burpees example video
function burpees() {
  videoSource.src = "media/burpees.mp4";
  video.style.display = "block";
  video.load();
}

//Function to display the plank example video
function plank() {
  videoSource.src = "media/plank.mp4";
  video.style.display = "block";
  video.load();
}

//Function to display the mountain climbers example video
function mountain() {
  videoSource.src = "media/mc.mp4";
  video.style.display = "block";
  video.load();
}

// Show name when logged in
function injectUser() {
  let user = getUser();
  let welcome = document.getElementById("welcome");
  if (user) {
    welcome.innerHTML = `Welcome, ${user.username}!`;
    document.getElementById("nav-login").style.display = "none";
  } else {
    document.getElementById("nav-logout").style.display = "none";
    welcome.style.display = "none";
  }
}
injectUser();

// Logout functionality
let nav_logout = document.getElementById("nav-logout");
nav_logout &&
  nav_logout.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    location.reload();
  });

// Login form
let loginForm = document.getElementById("login-form");
loginForm &&
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let res = await fetch("https://gymz.nourgaser.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    let data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "./index.html";
  });

// Register form functionality
const registerForm = document.getElementById("register-form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const cpassword = document.querySelector("#cpassword");

registerForm &&
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let res = await fetch("https://gymz.nourgaser.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    let data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "./index.html";
  });

function validateInputs() {
  const usernameVal = username.value.trim();
  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();
  const cpasswordVal = cpassword.value.trim();
  let success = true;

  if (usernameVal === "") {
    success = false;
    setError(username, "Username is required");
  } else {
    setSuccess(username);
  }

  if (emailVal === "") {
    success = false;
    setError(email, "Email is required");
  } else if (!validateEmail(emailVal)) {
    success = false;
    setError(email, "Please enter a valid email");
  } else {
    setSuccess(email);
  }

  if (passwordVal === "") {
    success = false;
    setError(password, "Password is required");
  } else if (passwordVal.length < 8) {
    success = false;
    setError(password, "Password must be atleast 8 characters long");
  } else {
    setSuccess(password);
  }

  if (cpasswordVal === "") {
    success = false;
    setError(cpassword, "Confirm password is required");
  } else if (cpasswordVal !== passwordVal) {
    success = false;
    setError(cpassword, "Password does not match");
  } else {
    setSuccess(cpassword);
  }

  return success;
}
//element - password, msg- pwd is reqd
function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");

  errorElement.innerText = message;
  inputGroup.classList.add("error");
  inputGroup.classList.remove("success");
}

function setSuccess(element) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");

  errorElement.innerText = "";
  inputGroup.classList.add("success");
  inputGroup.classList.remove("error");
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
