
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    // center: [-73.5, 42], 
    center: ffcampground.geometry.coordinates,
    zoom: 9, // starting zoom
});


new mapboxgl.Marker()
    .setLngLat(ffcampground.geometry.coordinates)
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');