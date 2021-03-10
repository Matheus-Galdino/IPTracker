const search = document.querySelector(".input-container span");
const loader = document.querySelector("#loader");

const form = document.querySelector("form");
const locationContainer = document.querySelector(".location-container");

const ipP = document.getElementById("ipP");
const ispP = document.getElementById("ispP");
const timeP = document.getElementById("timeP");
const localP = document.getElementById("localP");

const map = L.map("map").setView([-27.2109325, -49.6448719], 13);
let marker;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

async function trackIp() {
  const apiKey = "at_Zkj2I9Rvs4tkAXdj4comO54BwLpvB";
  const query = document.querySelector(".input-container input").value;

  if (query === "") {
    throw new Error("An IP address is necessary");
  }

  const url = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${query}`;

  const result = await fetch(url);
  const json = await result.json();
  if (json.code == 422) {
    throw new Error(json.messages);
  }

  return json;
}

async function handler(e) {
  e.preventDefault();

  loader.classList.add("active");

  try {
    const json = await trackIp();

    ipP.innerText = json.ip;
    ispP.innerText = json.isp;
    timeP.innerText = `UTC ${json.location.timezone}`;
    localP.innerText = `${json.location.city}, ${json.location.region
      .slice(0, 2)
      .toUpperCase()} ${json.location.postalCode}`;

    locationContainer.classList.add("active");

    const geoLocation = [json.location.lat, json.location.lng];
    map.setView(geoLocation, 13);
    if (marker) map.removeLayer(marker);
    marker = L.marker(geoLocation).addTo(map);
  } catch (error) {
    alert(error.message);
    return;
  } finally {
    loader.classList.remove("active");
  }
}

search.addEventListener("submit", handler);
form.addEventListener("submit", handler);
