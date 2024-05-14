let map;  // Declare the map variable outside the event listener

const form = document.getElementById('form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const apiKey = 'at_p5qrlJDjCiRu6AM52xJhqooU7MfXS';
  const input = document.getElementById('ip_address');
  const ipAddress = input.value;
  const showAddress = document.querySelector('.location');
  const showIpAddress = document.querySelector('.ip_address_display');
  const showTime = document.querySelector('.time');
  const showIsp = document.querySelector('.isp');
  const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`;

  fetch(apiUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .then(data => {
    console.log(data);
    const country = data.location.country;
    const city = data.location.city;
    const pincode = data.location.postalCode;
    const time = data.location.timezone;
    const isp = data.isp;
    const Lat = data.location.lat;
    const Lng = data.location.lng;

    showAddress.textContent = `${city}, ${country}, ${pincode}`;
    showIpAddress.textContent = ipAddress;
    showTime.textContent = time;
    showIsp.textContent = isp;

    // Check if the map is already initialized
    if (!map) {
      // Initialize the map for the first time
      map = L.map('map').setView([Lat, Lng], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
    } else {
      // Update the map view and marker
      map.setView([Lat, Lng], 13);
    }

    // Remove existing markers if any
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new marker
    L.marker([Lat, Lng]).addTo(map);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  input.value = '';
});
