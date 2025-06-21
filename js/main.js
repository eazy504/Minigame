const map = L.map('map').setView([20, 0], 2);

// Vintage-style light base map (still accurate for click mapping)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load 1914 country borders
fetch('data/countries-1914.geojson')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      style: feature => ({
        fillColor: getColor(feature.properties.owner),
        fillOpacity: 0.65,
        color: '#5a3d1e', // dark brown borders
        weight: 1
      }),
      onEachFeature: onEachFeature
    }).addTo(map);
  });

function onEachFeature(feature, layer) {
  // Country label (permanent tooltip)
  layer.bindTooltip(feature.properties.name, {
    permanent: true,
    direction: 'center',
    className: 'country-label'
  });

  // Popup on click
  layer.bindPopup(`
    <div class="popup">
      <b>${feature.properties.name}</b><br>
      Owner: ${feature.properties.owner}<br>
      Troops: ${feature.properties.troops}
    </div>
  `);

  // Click to edit troops or ownership
  layer.on('click', () => {
    const newOwner = prompt('New owner?', feature.properties.owner);
    const newTroops = parseInt(prompt('New troop count?', feature.properties.troops), 10);
    if (newOwner) feature.properties.owner = newOwner;
    if (!isNaN(newTroops)) feature.properties.troops = newTroops;
    layer.setStyle({ fillColor: getColor(newOwner) });
    layer.setPopupContent(`
      <div class="popup">
        <b>${feature.properties.name}</b><br>
        Owner: ${feature.properties.owner}<br>
        Troops: ${feature.properties.troops}
      </div>
    `).openPopup();
  });
}

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
  return colors[owner] || '#bfb0a3'; // fallback color
}
