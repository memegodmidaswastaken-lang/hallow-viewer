// =======================
// Configuration
// =======================
const API_BASE = "/.netlify/functions"; // Netlify functions folder
let currentUser = null;

// =======================
// Dark Mode Toggle
// =======================
const darkToggle = document.getElementById("dark-mode-toggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// =======================
// Login / Register
// =======================
document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    currentUser = data;
    showApp();
  } else alert(data.error);
});

document.getElementById("registerBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) alert("Registered! Login now.");
  else alert(data.error);
});

// =======================
// Show App after login
// =======================
function showApp() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("welcome").innerText = `Welcome, ${currentUser.username}`;
  document.getElementById("title").innerText = currentUser.title || "";
  if (currentUser.profile_pic) document.getElementById("profile-pic").src = currentUser.profile_pic;
  initMap();
  loadReviews();
}

// =======================
// Map with Leaflet.js
// =======================
let map;
let markers = [];

async function initMap() {
  map = L.map('map').setView([39.5, -98.35], 4); // USA center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  loadHouses();
}

async function loadHouses() {
  // Fetch houses from Supabase
  const res = await fetch(`${API_BASE}/getHouses`);
  const houses = await res.json();
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  houses.forEach(h => {
    const marker = L.marker([h.lat, h.lng]).addTo(map)
      .bindPopup(`
        <b>Rating:</b> ${h.rating}<br>
        <b>Gluten:</b> ${h.glutenFree}<br>
        <b>Sugar:</b> ${h.sugarFree}<br>
        <b>Lactose:</b> ${h.lactoseFree}<br>
        <b>Description:</b> ${h.description || ""}<br>
        ${h.image ? `<img src="${h.image}" width="100">` : ""}
      `);
    markers.push(marker);
  });
}

// =======================
// Add House
// =======================
document.getElementById("addHouseBtn").addEventListener("click", async () => {
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);
  const rating = document.getElementById("rating").value;
  const glutenFree = document.getElementById("glutenFree").checked;
  const sugarFree = document.getElementById("sugarFree").checked;
  const lactoseFree = document.getElementById("lactoseFree").checked;
  const other = document.getElementById("other").value;
  const description = document.getElementById("description").value;
  
  const fileInput = document.getElementById("houseImage");
  let imageBase64 = null;
  let imageName = null;

  if (fileInput.files.length) {
    const file = fileInput.files[0];
    imageName = file.name;
    imageBase64 = await fileToBase64(file);
  }

  const res = await fetch(`${API_BASE}/addHouse`, {
    method: "POST",
    body: JSON.stringify({
      lat, lng, rating, glutenFree, sugarFree, lactoseFree, other, description,
      user_id: currentUser.id,
      imageBase64, imageName
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert("House added!");
    loadHouses();
  } else alert(data.error);
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // remove base64 prefix
    reader.onerror = error => reject(error);
  });
}

// =======================
// Reviews
// =======================
async function loadReviews() {
  const res = await fetch(`${API_BASE}/getReviews`);
  const reviews = await res.json();
  const container = document.getElementById("reviewList");
  container.innerHTML = "";
  reviews.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${r.username}</b>: ${r.review}`;
    container.appendChild(div);
  });
}

document.getElementById("addReviewBtn").addEventListener("click", async () => {
  const review = document.getElementById("reviewText").value;
  if (!review) return;
  const res = await fetch(`${API_BASE}/addReview`, {
    method: "POST",
    body: JSON.stringify({
      house_id: 1, // Example: you need to select which house this review belongs to
      user_id: currentUser.id,
      review
    })
  });
  const data = await res.json();
  if (res.ok) {
    loadReviews();
    document.getElementById("reviewText").value = "";
  } else alert(data.error);
});
