let map = L.map('map').setView([40, -95], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let currentUser = null;
const NETLIFY_FUNCTIONS_BASE = '/.netlify/functions';

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
});

async function api(func, data) {
  const res = await fetch(`${NETLIFY_FUNCTIONS_BASE}/${func}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

function showLogin() {
  const ua = document.getElementById("userArea");
  if (currentUser)
    ua.innerHTML = `<img src="${currentUser.profile_pic || '/default.png'}" class="pfp"> ${currentUser.username} (${currentUser.role}) <button onclick="logout()">Logout</button>`;
  else
    ua.innerHTML = `<button onclick="promptLogin()">Login / Register</button>`;
}
showLogin();

async function promptLogin() {
  const username = prompt("Username:");
  const password = prompt("Password:");
  const register = confirm("Register new account?");
  const route = register ? "register" : "login";
  const res = await api(route, { username, password });
  if (res.error) return alert(res.error);
  if (register) alert("Registered! Now login again.");
  else { currentUser = res; showLogin(); loadHouses(); }
}

function logout() { currentUser = null; showLogin(); }

async function loadHouses() {
  const res = await api('getHouses', {});
  res.forEach(h => {
    const marker = L.marker([h.lat, h.lng]).addTo(map);
    marker.bindPopup(`<b>${h.rating}</b><br>${h.description}<br><img src="${h.image || ''}" width=100>`);
  });
}
loadHouses();
