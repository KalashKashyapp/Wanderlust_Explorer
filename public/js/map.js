mapboxgl.accessToken = mapToken;
if (listing.geometry && Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2) {
    const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    // console.log("Coordinates: ", listing.geometry.coordinates);

    // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates) // listing geometry coordinates
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
        ))
        .addTo(map);
} else {
    document.getElementById('map').innerHTML = "<p>Location data not available for this listing.</p>";
}
