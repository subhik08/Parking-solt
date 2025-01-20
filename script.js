let map;
let markers = [];
let parkingSpots = [];
let currentInfoWindow = null; // Reference to the currently open InfoWindow

// Function to generate random parking spots (100 spots scattered)
function generateRandomSpots() {
  const spots = [];
  const baseLat = 40.730610; // Central point latitude
  const baseLng = -73.935242; // Central point longitude

  for (let i = 0; i < 100; i++) {
    let randomLat = baseLat + (Math.random() - 0.5) * 0.01; // Randomize lat within range
    let randomLng = baseLng + (Math.random() - 0.5) * 0.01; // Randomize lng within range
    spots.push({
      lat: randomLat,
      lng: randomLng,
      name: `Spot ${i + 1}`,
      reserved: false
    });
  }

  return spots;
}

// Initialize the Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.730610, lng: -73.935242 },
    zoom: 14
  });

  parkingSpots = generateRandomSpots(); // Generate the 100 parking spots

  // Loop through the parking spots and add markers
  parkingSpots.forEach(spot => {
    const marker = new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map: map,
      title: spot.name,
      icon: spot.reserved ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    markers.push(marker); // Store the marker

    // Add the spot to the dropdown
    const option = document.createElement("option");
    option.value = spot.name;
    option.textContent = spot.name;
    document.getElementById("spotSelect").appendChild(option);

    // Add hover event to show the slot number
    google.maps.event.addListener(marker, 'mouseover', function() {
      if (!spot.reserved) {
        const infowindow = new google.maps.InfoWindow({
          content: `Slot: ${spot.name}`,
          position: marker.getPosition()
        });

        // Close any previously open InfoWindow before opening a new one
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }

        currentInfoWindow = infowindow; // Store the reference of the open InfoWindow
        infowindow.open(map, marker); // Open the new InfoWindow
      }
    });

    // Remove the info window when the mouse leaves
    google.maps.event.addListener(marker, 'mouseout', function() {
      if (currentInfoWindow) {
        currentInfoWindow.close(); // Close the open InfoWindow
        currentInfoWindow = null; // Reset the current InfoWindow reference
      }
    });

    // Add click event to the marker
    marker.addListener('click', function() {
      if (spot.reserved) {
        alert("This spot is already reserved.");
      } else {
        if (confirm(`Do you want to reserve ${spot.name}?`)) {
          spot.reserved = true;
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
          alert(`${spot.name} has been successfully reserved!`);
        }
      }
    });
  });
}

// Handle form submission
document.getElementById('reservationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const userName = document.getElementById("userName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const vehicleDetails = document.getElementById("vehicleDetails").value;
  const selectedSpot = document.getElementById("spotSelect").value;
  const duration = document.getElementById("duration").value;

  const spot = parkingSpots.find(spot => spot.name === selectedSpot);

  if (spot && !spot.reserved) {
    spot.reserved = true;
    document.getElementById("reservationStatus").style.display = 'block';
    document.getElementById("reservationStatus").textContent = `Reservation Confirmed! ${userName}, your vehicle (${vehicleDetails}) is reserved at ${selectedSpot} for ${duration} hours.`;
    document.getElementById("reservationStatus").classList.add("confirmation-message");
    alert(`${selectedSpot} has been successfully reserved!`);
  } else {
    document.getElementById("errorStatus").style.display = 'block';
    document.getElementById("errorStatus").textContent = "Please select a valid parking spot or check availability!";
    document.getElementById("errorStatus").classList.add("error-message");
  }
});
