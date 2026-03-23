// OPEN / CLOSE CHAT
function toggleChat() {
  const chat = document.getElementById("chatOverlay");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

// SEND MESSAGE
function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  const chatBody = document.getElementById("chatBody");

  if (message === "") return;

  // USER MESSAGE
  const userMsg = document.createElement("p");
  userMsg.classList.add("user");
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);

  input.value = "";

  // AUTO REPLY
  setTimeout(() => {
    const botMsg = document.createElement("p");
    botMsg.classList.add("bot");
    botMsg.textContent = getBotReply(message);
    chatBody.appendChild(botMsg);

    chatBody.scrollTop = chatBody.scrollHeight;
  }, 800);
}

// SIMPLE BOT RESPONSES
function getBotReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello 👋 How can I assist you today?";
  } 
  else if (msg.includes("deposit")) {
    return "To deposit, go to your dashboard and click deposit.";
  } 
  else if (msg.includes("bitcoin")) {
    return "Bitcoin price updates will be available soon 🚀";
  } 
  else if (msg.includes("help")) {
    return "Sure! Tell me what you need help with.";
  } 
  else {
    return "I’m here to help! Please explain more 😊";
  }
}


function toggleMenu() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("active");
}





/// =====================
// SIGNUP (SAVE USER)
// =====================
document.getElementById("signupForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  localStorage.setItem("user", JSON.stringify({ email, password }));

  
  localStorage.setItem("currentUser", email);
  localStorage.setItem("balance_" + email, 0);
  localStorage.setItem("history_" + email, JSON.stringify([]));

  alert("Account created!");
  window.location.href = "dashboard.html";
});


// =====================
// LOGIN (CHECK USER)
// =====================
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  const user = JSON.parse(localStorage.getItem("user"));

 if (user && user.email === email && user.password === password) {

  
  localStorage.setItem("currentUser", email);

  alert("Login successful!");
  window.location.href = "dashboard.html";
} else {
    alert("Invalid login details");
  }
});





// =====================
// BALANCE SYSTEM
// =====================
// LOAD SAVED BALANCE
// =====================
// CURRENT USER
// =====================
const currentUser = localStorage.getItem("currentUser");

let totalDeposit = Number(localStorage.getItem("totalDeposit_" + currentUser)) || 0;
let totalWithdraw = Number(localStorage.getItem("totalWithdraw_" + currentUser)) || 0;
let bonus = 0;
let profit = 0;

// =====================
// BALANCE SYSTEM (PER USER)
// =====================
let balance = localStorage.getItem("balance_" + currentUser)
  ? Number(localStorage.getItem("balance_" + currentUser))
  : 0;

function updateBalance() {
  const balanceEl = document.getElementById("balance");
  if (balanceEl) {
    balanceEl.innerText = "$" + balance.toFixed(2);
  }

  // SAVE USER BALANCE
  localStorage.setItem("balance_" + currentUser, balance);
}

// =====================
// HISTORY SYSTEM (PER USER)
// =====================
let history = JSON.parse(localStorage.getItem("history_" + currentUser)) || [];

function addHistory(text) {
  history.push(text);

  // SAVE USER HISTORY
  localStorage.setItem("history_" + currentUser, JSON.stringify(history));

  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("history");
  if (!list) return;

  list.innerHTML = "";

  history.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderPendingDeposits() {
  const list = document.getElementById("pendingDeposits");
  if (!list) return;

  const deposits = JSON.parse(localStorage.getItem("deposits_" + currentUser)) || [];

  list.innerHTML = "";

  deposits.forEach((dep, index) => {
    if (dep.status === "pending") {
      const li = document.createElement("li");

      li.innerHTML = `
        $${dep.amount} - Pending 
        <button onclick="approveDeposit(${index})">Approve</button>
      `;

      list.appendChild(li);
    }
  });
}

// =====================
// DEPOSIT
// =====================
function deposit(amount) {

  totalDeposit += amount;

  localStorage.setItem("totalDeposit_" + currentUser, totalDeposit);

  addHistory("Deposited $" + amount + " - " + new Date().toLocaleString());

  updateBalance();
  updateStats();
}

// CUSTOM DEPOSIT
function submitDeposit() {
  const input = document.getElementById("depositAmount");
  const amount = input.value.trim(); // 👈 get raw value
  const method = document.getElementById("paymentMethod").value;

  console.log("Typed Amount:", amount); // 🔍 DEBUG

  if (!amount || Number(amount) <= 0) {
    alert("Enter valid amount");
    return;
  }

  // SAVE as NUMBER
  localStorage.setItem("pendingDeposit", JSON.stringify({
    amount: Number(amount),
    method: method
  }));

  console.log("Saved:", localStorage.getItem("pendingDeposit")); // 🔍 DEBUG

  window.location.href = "deposit-details.html";
}

// =====================
// WITHDRAW
// =====================
// =====================
// WITHDRAW
// =====================
function withdraw() {
  if (balance <= 0) {
    alert("No funds to withdraw");
    return;
  }

  document.getElementById("withdrawModal").style.display = "flex";
}

function closeWithdraw() {
  document.getElementById("withdrawModal").style.display = "none";
}

function verifyWithdraw() {
  const code = document.getElementById("withdrawCode").value;

  if (code === "") {
    alert("Enter verification code");
    return;
  }

  // SAVE PENDING WITHDRAWAL
  localStorage.setItem("pendingWithdraw_" + currentUser, balance);

  addHistory("Withdrawal request: $" + balance + " (Pending approval)");

  alert("Withdrawal submitted. Awaiting admin approval.");

  closeWithdraw();
}

// =====================
// FAKE EMAIL
// =====================
function sendFakeEmail(message) {
  console.log("📧 Email sent:", message);
}

// =====================
// LOGOUT
// =====================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// =====================
// PAGE LOAD
// =================



function updateLastUpdate() {
  const now = new Date().toLocaleString();
  const el = document.getElementById("lastUpdate");
  if (el) el.textContent = now;
}




function updateStats() {
  const depositEl = document.getElementById("totalDeposit");
  const withdrawEl = document.getElementById("totalWithdraw");
  const profitEl = document.getElementById("profit");
  const bonusEl = document.getElementById("bonus");

  if (depositEl) depositEl.innerText = "$" + totalDeposit;
  if (withdrawEl) withdrawEl.innerText = "$" + totalWithdraw;
  if (profitEl) profitEl.innerText = "$" + profit;
  if (bonusEl) bonusEl.innerText = "$" + bonus;
}



function goToDeposit() {
  window.location.href = "deposit.html";
}


function selectMethod(method, el) {
  const select = document.getElementById("paymentMethod");
  select.value = method;

  document.querySelectorAll(".method").forEach(e => {
    e.classList.remove("active");
  });

  el.classList.add("active");
}




function copyAddress() {
  const address = document.getElementById("walletAddress").innerText;
  navigator.clipboard.writeText(address);
  alert("Address copied!");
}

function submitProof() {
  alert("Payment proof submitted! Await confirmation.");

  // Save as pending deposit
  let deposits = JSON.parse(localStorage.getItem("deposits_" + currentUser)) || [];

  const data = JSON.parse(localStorage.getItem("pendingDeposit"));

  deposits.push({
    ...data,
    status: "pending",
    date: new Date().toLocaleString()
  });

  localStorage.setItem("deposits_" + currentUser, JSON.stringify(deposits));

  localStorage.removeItem("pendingDeposit");

  window.location.href = "dashboard.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

  // DASHBOARD
  updateBalance();
  renderHistory();
  updateStats();
  updateLastUpdate();
  renderPendingDeposits();

  // DEPOSIT DETAILS PAGE
  const data = JSON.parse(localStorage.getItem("pendingDeposit"));

  console.log("Deposit Data:", data); // 🔍 DEBUG

  if (data) {
    const amountEl = document.getElementById("depositAmountDisplay");
    const walletEl = document.getElementById("walletAddress");

    if (amountEl) {
      amountEl.innerText = "$" + data.amount;
    }

    if (walletEl) {
      walletEl.innerText = "13xi5ic9aXZZM2D24LUD7PkRb5MvifbXhp";
    }
  }
});

function approveDeposit(index) {
  let deposits = JSON.parse(localStorage.getItem("deposits_" + currentUser)) || [];

  const deposit = deposits[index];

  if (!deposit || deposit.status !== "pending") return;

  // ✅ Change status
  deposit.status = "approved";

  // ✅ Add to balance
  balance += Number(deposit.amount);

  // ✅ Update total deposit
  totalDeposit += Number(deposit.amount);

  // Save everything
  localStorage.setItem("deposits_" + currentUser, JSON.stringify(deposits));
  localStorage.setItem("balance_" + currentUser, balance);
  localStorage.setItem("totalDeposit_" + currentUser, totalDeposit);

  // Add history
  addHistory("Deposit Approved: $" + deposit.amount);

  // Refresh UI
  updateBalance();
  updateStats();
  renderPendingDeposits();

  alert("Deposit Approved!");
}
