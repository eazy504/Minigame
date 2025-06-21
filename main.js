const map = L.map('map', {zoomControl: false}).setView([20, 0], 2);

// Vintage-style base map with English labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Overlay a 1914-style historic map image
L.imageOverlay('assets/1914_map.jpg', [[-60, -180], [85, 180]], {
  opacity: 0.6
}).addTo(map);

// Load and render country borders
fetch('data/countries-1914.geojson')
  .then(r => r.json())
  .then(data => L.geoJSON(data, {
    style: f => ({
      fillColor: getColor(f.properties.owner),
      fillOpacity: 0.65,
      color: '#5a3d1e',
      weight: 1
    }),
    onEachFeature: onEachFeature
  }).addTo(map));

// Render terrain overlays (mountains, deserts)
addTerrainLayer(map);

function onEachFeature(feature, layer) {
  layer.bindTooltip(feature.properties.name, {
    permanent: true,
    direction: 'center',
    className: 'country-label'
  });
  layer.bindPopup(`<div class="popup"><b>${feature.properties.name}</b><br>
    Owner: ${feature.properties.owner}<br>
    Troops: ${feature.properties.troops}</div>`);
  layer.on('click', () => {
    const newOwner = prompt('New owner?', feature.properties.owner);
    const newTroops = parseInt(prompt('New troop count?', feature.properties.troops), 10);
    if (newOwner) feature.properties.owner = newOwner;
    if (!isNaN(newTroops)) feature.properties.troops = newTroops;
    layer.setStyle({ fillColor: getColor(newOwner) });
    layer.setPopupContent(`<div class="popup"><b>${feature.properties.name}</b><br>
      Owner: ${feature.properties.owner}<br>
      Troops: ${feature.properties.troops}</div>`).openPopup();
    document.getElementById('research-content').innerHTML = `
      <h3>${feature.properties.name} Research</h3><ul>
        <li>Infantry Upgrade I</li><li>Artillery Research</li><li>Factory Expansion</li>
      </ul>`;
  });
}

function getColor(owner) {
  const c = {
    France: '#c97c63', Germany: '#7e5739', UK: '#b36a5e',
    Russia: '#a28c6a', Austria: '#9b7250', Ottoman: '#82685e',
    Italy: '#8d6e5c', Japan: '#aaa693'
  };
  return c[owner] || '#bfb0a3';
}

// Sidebar toggle with Leaflet re-render
document.getElementById('toggle-sidebar').onclick = () => {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('open');
  setTimeout(() => map.invalidateSize(), 300);
};
