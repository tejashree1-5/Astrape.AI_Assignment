const API_URL = "http://localhost/ecommerce-app/backend"; // adjust if needed

// 🔄 Password toggle
function toggle(id){
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

// 🔔 Toast helper
function showToast(msg){
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 3000);
}

// 🔑 Signup
async function signup(){
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  if(password.length < 6) return showToast("Password must be 6+ chars");
  const res = await fetch(`${API_URL}/auth/signup.php`, {
    method:"POST",
    body:JSON.stringify({ username, password })
  });
  const data = await res.json();
  if(data.message) showToast("Signup successful!");
  else showToast("Signup failed");
}

// 🔑 Login
async function login(){
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const res = await fetch(`${API_URL}/auth/login.php`, {
    method:"POST",
    body:JSON.stringify({ username, password })
  });
  const data = await res.json();
  if(data.token){
    localStorage.setItem("jwt", data.token);
    showToast("Login successful!");
    setTimeout(()=>window.location.href="items.html",1500);
  } else showToast("Invalid credentials");
}

// 📦 Fetch Items
async function fetchItems(){
  const cat = document.getElementById("category").value;
  const min = document.getElementById("min").value;
  const max = document.getElementById("max").value;
  let url = `${API_URL}/items/list.php`;
  const params = [];
  if(cat) params.push(`category=${encodeURIComponent(cat)}`);
  if(min && max) params.push(`min_price=${min}&max_price=${max}`);
  if(params.length) url += `?${params.join("&")}`;

  const res = await fetch(url);
  const items = await res.json();
  const container = document.getElementById("items-container");
  container.innerHTML = items.map(i=>`
    <div class="item-card">
      <div class="item-title">${i.name}</div>
      <div class="item-price">$${i.price}</div>
      <button onclick="addToCart(${i.id})">Add to Cart</button>
    </div>
  `).join("");
}

// ➕ Add to cart
async function addToCart(itemId){
  const token = localStorage.getItem("jwt");
  if(!token) return showToast("Login required");
  const res = await fetch(`${API_URL}/cart/add.php`, {
    method:"POST", headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ item_id:itemId })
  });
  showToast("Item added to cart");
}

// 🛒 Load Cart
async function loadCart(){
  const res = await fetch(`${API_URL}/cart/list.php`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
  });
  const items = await res.json();
  const container = document.getElementById("cart-container");
  container.innerHTML = items.map(i=>`
    <div class="item-card">
      <div class="item-title">${i.name}</div>
      <div class="item-price">$${i.price}</div>
      <button onclick="removeFromCart(${i.id})">Remove</button>
    </div>
  `).join("");
}

// ➖ Remove
async function removeFromCart(itemId){
  const res = await fetch(`${API_URL}/cart/remove.php`, {
    method:"POST",
    headers:{ "Authorization": `Bearer ${localStorage.getItem("jwt")}` },
    body:JSON.stringify({ item_id:itemId })
  });
  showToast("Removed from cart");
  loadCart();
}
