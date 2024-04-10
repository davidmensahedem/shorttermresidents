$(document).ready(function () {


    // Leaflet Js Implementations
    var map = L.map('map').setView([51.0447, -114.0719], 13);

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Add a marker for Calgary
    L.marker([51.0447, -114.0719])
        .addTo(map)
        .bindPopup('Calgary')
        .openPopup();


    // Load CSV file and convert to GeoJSON
    let schoolLocationsGeoJson = loadCSV('static/data/School_Locations.csv');

    L.geoJSON(schoolLocationsGeoJson, {
        pointToLayer: function(feature, latlng) {
            var marker = L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'static/image/school.png',
                    iconSize: [20, 20],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            });
            marker.bindPopup(JSON.stringify(feature.properties));
            return marker;
        }
    }).addTo(map);






    // Function to toggle side navigation 
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.getElementById('main-content');
    let sideBarHeader = document.getElementById('sideBarHeader');
    let sideBarHeaderTitle = document.getElementById('sideBarHeaderTitle');
    let mapDiv = document.getElementById('map');
    let shareLocBtn = document.getElementById('shareLocBtn');

    var currentDate = new Date().toTimeString();
    document.getElementById("currentDate").innerHTML = currentDate;

    // Add transition to sidebar and main content




    // Function to get user's location coordinates
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var coordinates = "Latitude: " + latitude + ", Longitude: " + longitude;
                document.getElementById("showShareLocCordinates").innerHTML = coordinates;
            });
        } else {
            document.getElementById("showShareLocCordinates").innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    // Call the function to get user's location
    getUserLocation();









    // Function to load CSV file and convert to GeoJSON
    function loadCSV(csvFilePath) {
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                var data = results.data;
                var features = [];
                data.forEach(function(row) {
                    var lat = row.latitude;
                    var lon = row.longitude;
                    if (lat && lon) {
                        features.push({
                            type: 'Feature',
                            properties: row,
                            geometry: {
                                type: 'Point',
                                coordinates: [lon, lat]
                            }
                        });
                    }
                });

                var geojson = {
                    type: 'FeatureCollection',
                    features: features
                };

                L.geoJSON(geojson, {
                    pointToLayer: function(feature, latlng) {
                        var marker = L.marker(latlng, {
                            icon: L.icon({
                                iconUrl: 'static/image/school.png',
                                iconSize: [20, 20],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41]
                            })
                        });
                        marker.bindPopup(JSON.stringify(feature.properties));
                        return marker;
                    }
                }).addTo(map);

            }
        });
    }

});




