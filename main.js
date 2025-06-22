// Initialize map
const map = L.map('map').setView([30, 10], 2);

// Base map (English map tiles)
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
// Switch to CartoDB Positron tiles to avoid authentication errors
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
  attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
}).addTo(map);

// Initialize draw control
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Load GeoJSON
fetch('countries-1914.geojson')
  .then(res => res.json())
  .then(data => {
    const geoJsonLayer = L.geoJSON(data, {
      style: {
        color: '#333',
        weight: 1,
        fillColor: '#74c476',
        fillOpacity: 0.5
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          const newOwner = prompt(`Assign new owner to ${feature.properties.name}:`, feature.properties.owner);
          if (newOwner) {
            feature.properties.owner = newOwner;
            layer.bindPopup(`<b>${feature.properties.name}</b><br>Owner: ${newOwner}<br>Troops: ${feature.properties.troops}`).openPopup();
          }
        });
