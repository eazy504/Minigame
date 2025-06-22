// Initialize map
const map = L.map('map').setView([30, 10], 2);

// Base map (natural Earth style)
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
}).addTo(map);

// Optional: historical overlay
L.imageOverlay('assets/1914_Map.jpg', [[85, -180], [-60, 180]], {
  opacity: 0.5
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
        layer.bindPopup(`<b>${feature.properties.name}</b><br>Owner: ${feature.properties.owner}<br>Troops: ${feature.properties.troops}`);
      }
    });

    geoJsonLayer.eachLayer(layer => {
      drawnItems.addLayer(layer);
    });
  });

// Leaflet.Draw controls
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false
    }
  },
  draw: false // disable new shapes unless needed
});
map.addControl(drawControl);

// Save edits to console (you can export to file/database later)
map.on(L.Draw.Event.EDITED, function (e) {
  const layers = e.layers;
  layers.eachLayer(function (layer) {
    console.log('Edited feature:', layer.toGeoJSON());
  });
});
