const map = L.map('map').setView([20, 0], 2);

// English-label base map (CartoDB Positron)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load the 1914 country borders from GeoJSON
fetch('data/countries-1914.geojson')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      style: feature => ({
        fillColor: getColor(feature.properties.owner),
        fillOpacity: 0.6,
        color: '#000',
        weight: 1
      }),
      onEachFeature: onEachFeature
    }).addTo(map);
  });

// Set popup and permanent label for each country
function onEachFeature(feature, layer) {
  layer.bindPopup(`
    <b>${feature.properties.name}</b><br>
    Owner: ${feature.properties.owner}<br>
    Troops: ${feature.properties.troops}
  `);

  // Permanent country name label
  layer.bindTooltip(feature.properties.name, {
    permanent: true,
    direction: "center",
    className: "country-label"
  });

  // Interaction for troop and ownership updates
  layer.on('click', () => {
    const newOwner = prompt('New owner?', feature.properties.owner);
    const newTroops = parseInt(prompt('New troop count?', feature.properties.troops), 10);
    if (newOwner) feature.properties.owner = newOwner;
    if (!isNaN(newTroops)) feature.properties.troops = newTroops;
    layer.setStyle({ fillColor: getColor(newOwner) });
    layer.setPopupContent(`
      <b>${feature.properties.name}</b><br>
      Owner: ${feature.properties.owner}<br>
      Troops: ${feature.properties.troops}
    `).openPopup();
  });
}

// Color countries by owner
function getColor(owner) {
  const colors = {
    France: '#0055a4',
    Germany: '#333',
    UK: '#cc0000',
    Russia: '#0039a6',
    Austria: '#7f0000',
    Ottoman: '#a66',
    Italy: '#008000',
    Japan: '#bc002d'
  };
  return colors[owner] || '#999';
}
