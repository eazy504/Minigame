// Initialize the map and center it on a global view
const map = L.map('map').setView([20, 0], 2);

// Load natural Earth-style base map
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
}).addTo(map);

// Add your historical 1914 overlay image (must be in assets folder)
const historicalMap = L.imageOverlay('assets/1914_Map.jpg', [[85, -180], [-60, 180]], {
  opacity: 0.5
});
historicalMap.addTo(map);

// Load GeoJSON for country tiles
fetch('countries-1914.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: '#333',
        weight: 1,
        fillColor: '#74c476',
        fillOpacity: 0.5
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        const owner = feature.properties.owner;
        const troops = feature.properties.troops;
        layer.bindPopup(`<b>${name}</b><br>Owner: ${owner}<br>Troops: ${troops}`);
      }
    }).addTo(map);
  });
