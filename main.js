// main.js

// Initialize the map
const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

// Add English-label Carto base map
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Add historic 1914 map overlay (ensure image is in assets folder)
const historicalMap = L.imageOverlay('assets/1914_Map.jpg', [[85, -180], [-60, 180]], {
  opacity: 0.6
});
historicalMap.addTo(map);

// Load 1914 country borders from GeoJSON
fetch('data/countries-1914.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: feature => ({
        fillColor: getColor(feature.properties.owner),
        fillOpacity: 0.65,
        color: '#5a3d1e',
        weight: 1
      }),
      onEachFeature: onEachFeature
    }).addTo(map);
  });

// Add terrain overlays (Alps, Sahara, etc.)
addTerrainLayer(map);

// Style popup and label behavior
function onEachFeature(feature, layer) {
  layer.bindTooltip(feature.properties.name, {
    permanent: true,
    direction: 'center',
    className: 'country-label'
  });

  layer.bindPopup(`<div class="popup">
    <b>${feature.properties.name}</b><br>
    Owner: ${feature.properties.owner}<br>
    Troops: ${feature.properties.troops}</div>`);

  layer.on('click', () => {
    const newOwner = prompt('New owner?', feature.properties.owner);
    const newTroops = parseInt(prompt('New troop count?', feature.properties.troops), 10);

    if (newOwner) feature.properties.owner = newOwner;
    if (!isNaN(newTroops)) feature.properties.troops = newTroops;

    layer.setStyle({ fillColor: getColor(newOwner) });
    layer.setPopupContent(`<div class="popup">
      <b>${feature.properties.name}</b><br>
      Owner: ${feature.properties.owner}<br>
      Troops: ${feature.properties.troops}</div>`).openPopup();

    document.getElementById('research-content').innerHTML = `
      <h3>${feature.properties.name} Research</h3>
      <ul>
        <li>Infantry Upgrade I</li>
        <li>Artillery Research</li>
        <li>Factory Expansion</li>
      </ul>`;
  });
}

// Set owner colors
function getColor(owner) {
  const colors = {
    France: '#c97c63',
    Germany: '#7e5739',
    UK: '#b36a5e',
    Russia: '#a28c6a',
    Austria: '#9b7250',
    Ottoman: '#82685e',
    Italy: '#8d6e5c',
    Japan: '#aaa693'
  };
  return colors[owner] || '#bfb0a3';
}

// Sidebar toggle and map refresh
document.getElementById('toggle-sidebar').onclick = () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  setTimeout(() => map.invalidateSize(), 300);
};
