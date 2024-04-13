// Document ready function
$(document).ready(function () {

    // Function to toggle side navigation 
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.getElementById('main-content');
    let sideBarHeader = document.getElementById('sideBarHeader');
    let sideBarHeaderTitle = document.getElementById('sideBarHeaderTitle');
    let mapDiv = document.getElementById('map');
    let shareLocBtn = document.getElementById('shareLocBtn');
    let viewAllLayersId = document.getElementById('viewAllLayersId');
    let getNearestShortTermRentalsBtn = document.getElementById('getNearestShortTermRentalsBtn');

    let userLat = 0;
    let userLon = 0;
    let maximumRentalsNumber = 10

    document.getElementById("currentDate").innerHTML = currentDate;

    viewAllLayersId.addEventListener('click', viewAllLayers);

    getNearestShortTermRentalsBtn.addEventListener('click', function () {
        if (userLat == 0 && userLon == 0)
            alert("Please share your location first");
        else
            getNearestShortTermRentals();
    });

    shareLocBtn.addEventListener('click', getUserLocation);

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

    // add a leaftjs scale to the map
    L.control.scale().addTo(map);

    // Leaflet Legend
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<h5>Legend</h5>' +
            '<i style="background: #ff0000"></i> Traffic Incidents<br>' +
            '<i style="background: #ff0000"></i> Community Service<br>' +
            '<i style="background: #0000ff"></i> Short Term Rentals';
        return div;
    };

    legend.addTo(map);
    // end of add map legend



    // Map Layers 
    // **********
    // **********
    // add a community service layer from a geojson api source
    var communityService = L.geoJson.ajax("https://data.calgary.ca/resource/x34e-bcjz.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "teal",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Community Service:</strong> " + feature.properties.name + "<br>" +
                "<strong>Address:</strong> " + feature.properties.address + "<br>" +
                "<strong>Phone:</strong> " + feature.properties.phone + "<br>" +
                "<strong>Website:</strong> <a href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a>";
            layer.bindPopup(popupContent);
        }
    })

    // add a traffic incidents layer from a geojson api source
    var trafficIncidents = L.geoJson.ajax("https://data.calgary.ca/resource/35ra-9556.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Incident:</strong> " + feature.properties.incident_info + "<br>" +
                "<strong>Location:</strong> " + feature.properties.location + "<br>" +
                "<strong>Details:</strong> " + feature.properties.details + "<br>" +
                "<strong>Reported:</strong> " + feature.properties.reported_at;
            layer.bindPopup(popupContent);
        }
    })

    // add a short term rentals layer from a geojson api source
    var shortTermRentals = L.geoJson.ajax("https://data.calgary.ca/resource/gzkz-5k9a.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "purple",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Address:</strong> " + feature.properties.address + "<br>" +
                "<strong>Neighbourhood:</strong> " + feature.properties.neighbourhood + "<br>" +
                "<strong>License Number:</strong> " + feature.properties.license_number + "<br>" +
                "<strong>License Type:</strong> " + feature.properties.license_type + "<br>" +
                "<strong>License Status:</strong> " + feature.properties.license_status + "<br>" +
                "<strong>License Expiry:</strong> " + feature.properties.license_expiry;
            layer.bindPopup(popupContent);
        }
    })

    // create a heat map out of the traffic incidents layer pick your source from the geojson api
    fetch('https://data.calgary.ca/resource/35ra-9556.geojson')
        .then(response => response.json())
        .then(data => {
            // Extract coordinates from GeoJSON features
            var heatMapData = data.features.map(feature => [
                feature.geometry.coordinates[1], // Latitude
                feature.geometry.coordinates[0], // Longitude
                10 // Intensity (you can customize this based on your data)
            ]);

            // Create the heat map layer
            var heatMapLayer = L.heatLayer(heatMapData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                radius: 20,
                gradient: { 0.4: 'red', 0.65: 'lime', 1: 'red' }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });


    // End of Map Layers 
    // **********
    // **********


    var baseLayers = {
        "Traffic Incidents": trafficIncidents,
        "Community Service": communityService,
        "Short Term Rentals": shortTermRentals
    };

    layercontrol = L.control.layers(baseLayers).addTo(map);





    // Function to get user's location coordinates
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                var coordinates = "Latitude: " + userLat + ", Longitude: " + userLon;
                document.getElementById("showShareLocCordinates").innerHTML = coordinates;
            });
        } else {
            document.getElementById("showShareLocCordinates").innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    // Function to remove layers control
    function removeLayersControl() {
        map.removeControl(layercontrol);
    }

    // Call the function to get user's location
    getUserLocation();

    // view all layers function
    function viewAllLayers() {

        communityService.addTo(map);
        trafficIncidents.addTo(map);
        shortTermRentals.addTo(map);
    }

    function getNearestShortTermRentals() {
        fetch('https://data.calgary.ca/resource/gzkz-5k9a.geojson')
            .then(response => response.json())
            .then(rentals => {
                console.log(rentals);
                // 2. Retrieve User's Live Location (Assuming userLocation is an array [lat, lon])
                var userLocation = [userLat, userLon]; // Get user's location
                console.log(rentals)
                // 3. Calculate Distances and Find Nearest Rentals
                rentals.features
                    .filter(feature => feature?.properties?.status_description.toLocaleLowerCase() === "licensed".toLocaleLowerCase())
                    .forEach(feature => {
                        var rentalLocation = [feature?.geometry?.coordinates[0], feature?.geometry?.coordinates[1]]; // Get rental property location
                        console.log(rentalLocation);
                        console.log(userLocation);
                        var distance = calculateDistance(userLocation, rentalLocation);
                        feature.properties.distance = distance; // Store distance in properties
                    });

                rentals.features.sort((a, b) => a.properties.distance - b.properties.distance); // Sort by distance

                var nearestRentals = rentals.features.slice(0, maximumRentalsNumber); // Get top 5 nearest rentals

                // 4. Display Results on Leaflet Map
                nearestRentals.forEach(rental => {

                    L.marker([rental.geometry.coordinates[1], rental.geometry.coordinates[0]], {
                        icon: L.icon({
                            iconUrl: 'static/image/homeicon.jpg',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    })
                        .addTo(map)
                        .bindPopup(rental?.properties?.status_description); // Display rental name in popup
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to calculate distance between two points (Haversine formula)
    function calculateDistance(point1, point2) {
        const R = 6371; // Radius of the Earth in kilometers
        const [lat1, lon1] = point1;
        const [lat2, lon2] = point2;

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
    }










});