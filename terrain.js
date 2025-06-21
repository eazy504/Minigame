const terrainData = {
  type: "FeatureCollection",
  features: [
    {type:"Feature", properties:{name:"Alps",type:"mountain"},
     geometry:{type:"Polygon",coordinates:[[[6.5,46.5],[10.5,46.5],[10.5,47.5],[6.5,47.5],[6.5,46.5]]]}}
   ,{type:"Feature", properties:{name:"Sahara Desert",type:"desert"},
     geometry:{type:"Polygon",coordinates:[[[-10.0,15.0],[30.0,15.0],[30.0,25.0],[-10.0,25.0],[-10.0,15.0]]]}}
   ,{type:"Feature", properties:{name:"Ural Mountains",type:"mountain"},
     geometry:{type:"Polygon",coordinates:[[[60.0,58.0],[61.5,58.0],[61.5,65.0],[60.0,65.0],[60.0,58.0]]]}}
   ,{type:"Feature", properties:{name:"Arabian Desert",type:"desert"},
     geometry:{type:"Polygon",coordinates:[[[40.0,20.0],[55.0,20.0],[55.0,30.0],[40.0,30.0],[40.0,20.0]]]}}
  ]
};

function addTerrainLayer(map) {
  L.geoJSON(terrainData,{
    style: f => {
      if(f.properties.type=='mountain') return {color:'#777', weight:1, fillOpacity:0.5, fillColor:'#999'};
      if(f.properties.type=='desert') return {color:'#c2b280', weight:1, fillOpacity:0.4, fillColor:'#e0d8b0'};
      return {color:'#888', weight:1, fillOpacity:0.3};
    },
    onEachFeature:(f,l)=>l.bindTooltip(f.properties.name, {permanent:false, direction:'center', className:'country-label'})
  }).addTo(map);
}
