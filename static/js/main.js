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


    var trafficIncidents = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'ericakuamoah06/clutb4152001a01qx1jeh5zm2', // Replace with your own Mapbox style ID
        accessToken: 'pk.eyJ1IjoiZXJpY2FrdWFtb2FoMDYiLCJhIjoiY2x0Ym9xaGEyMXY1ZzJrcGR5aDZhdjJ3cyJ9.JAiPKmIviFoezy5HMfLgYA'
    }).addTo(map);

    var shortTermRentals = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'ericakuamoah06/clutbwa9n001d01piby2zdq9n', // Replace with your own Mapbox style ID
        accessToken: 'pk.eyJ1IjoiZXJpY2FrdWFtb2FoMDYiLCJhIjoiY2x0Ym9xaGEyMXY1ZzJrcGR5aDZhdjJ3cyJ9.JAiPKmIviFoezy5HMfLgYA'
    }).addTo(map);
    

    var baseLayers = {
        "Traffic Incidents": trafficIncidents,
        "Short Term Rentals": shortTermRentals,
    };

    layercontrol = L.control.layers(baseLayers).addTo(map);







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
            navigator.geolocation.getCurrentPosition(function (position) {
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





});




