const map = L.map('map').setView([20, 0], 2);

// Natural terrain-style tile layer
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
}).addTo(map);

// Load and style GeoJSON
fetch('countries-1914.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        const owner = feature.properties.owner;
        const troops = feature.properties.troops;
        layer.bindPopup(`<b>${name}</b><br>Owner: ${owner}<br>Troops: ${troops}`);
      },
      style: {
        color: '#333',
        weight: 1,
        fillColor: '#74c476',
        fillOpacity: 0.5
      }
    }).addTo(map);
  });

// Optional: Add image overlay (if desired)
// const historicalMap = L.imageOverlay('assets/1914_Map.jpg', [[85, -180], [-60, 180]], { opacity: 0.4 });
// historicalMap.addTo(map);
