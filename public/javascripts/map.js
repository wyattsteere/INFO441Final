document.addEventListener("DOMContentLoaded", async () => {
  const map = L.map('map').setView([47.66154255, -122.30985726], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // flags
  let isPlacingMarker = false;
  let tempMarker = null;
  let isLoggedIn = false;

  // func to check for login status
  async function checkLoginStatus() {
      try {
          const response = await fetch('/api/v1/users/myIdentity');
          const data = await response.json();

          if (data.status === "loggedin") {
              isLoggedIn = true;
              console.log("User is logged in:", data.userInfo);
          } else {
              isLoggedIn = false;
              console.log("User is not logged in.");
          }
      } catch (err) {
          console.error("Error checking login status:", err);
          isLoggedIn = false;
      }
  }

  await checkLoginStatus();

  // toggle marker placement mode button functionaity
  document.getElementById("marker_button").addEventListener("click", () => {
      // only works if user logged in
      if (!isLoggedIn) {
          const errorDiv = document.getElementById("error_message");
          errorDiv.textContent = "You must be logged in to place a marker.";
          errorDiv.style.display = "block";
          return;
      }

      // toggle placement mode so that it resets everytime user places a button
      isPlacingMarker = !isPlacingMarker;
      console.log("Marker placement mode:", isPlacingMarker);

      // clear temp marker if exiting placement mode
      if (!isPlacingMarker && tempMarker) {
          map.removeLayer(tempMarker);
          tempMarker = null;
      }
  });

  async function loadMarkers() {
      try {
          console.log("Fetching markers from the backend...");
          const response = await fetch('/marker');
          const markers = await response.json();
          console.log("Markers fetched successfully:", markers);

          markers.forEach(marker => {
              if (marker.latitude !== undefined && marker.longitude !== undefined) {
                  L.marker([marker.latitude, marker.longitude])
                      .addTo(map)
                      .bindPopup(`<b>${marker.title}</b><br>${marker.description}`);
              } else {
                  console.warn("Skipping marker due to missing coordinates:", marker);
              }
          });

          console.log("All markers loaded onto the map.");
      } catch (err) {
          console.error("Error fetching markers:", err);
      }
  }

  await loadMarkers();

  // map click event for placing new markers
  map.on("click", (e) => {
      if (!isPlacingMarker) return;

      console.log("Map clicked at:", e.latlng);

      // remove any existing temp marker
      if (tempMarker) {
          map.removeLayer(tempMarker);
      }

      // place a temp marker
      tempMarker = L.marker(e.latlng).addTo(map);

      // add popup with input fields and confirm button
      tempMarker.bindPopup(
          `<div>
              <label>Title:</label><br>
              <input id="markerTitle" type="text" placeholder="Enter title"><br>
              <label>Description:</label><br>
              <textarea id="markerDescription" rows="3" placeholder="Enter description"></textarea><br>
              <button id="confirmMarker">Confirm</button>
          </div>`
      ).openPopup();

      console.log("Temporary marker placed at:", e.latlng);

      // event listener for confirm button
      setTimeout(() => {
          const confirmButton = document.getElementById("confirmMarker");
          if (confirmButton) {
              confirmButton.addEventListener("click", async () => {
                  const title = document.getElementById("markerTitle").value.trim();
                  const description = document.getElementById("markerDescription").value.trim();

                  if (title && description) {
                      console.log("Title:", title, "Description:", description);

                      // finalize marker placement
                      const finalizedMarker = L.marker(tempMarker.getLatLng()).addTo(map);
                      finalizedMarker.bindPopup(`<b>${title}</b><br>${description}`);

                      const markerData = {
                          title,
                          description,
                          latitude: tempMarker.getLatLng().lat,
                          longitude: tempMarker.getLatLng().lng
                      };

                      try {
                          const response = await fetch('/marker', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(markerData)
                          });

                          if (response.ok) {
                              console.log("Marker posted to backend successfully.");
                          } else {
                              console.error("Failed to post marker to backend.");
                          }
                      } catch (err) {
                          console.error("Error posting marker to backend:", err);
                      }

                      map.removeLayer(tempMarker); // remove the temp marker
                      tempMarker = null; // reset flags
                      isPlacingMarker = false;

                      console.log("Marker finalized with info.");
                  } else {
                      console.error("Both title and description are required.");
                  }
              });
          }
      }, 0); // delay to ensure the DOM updates
  });
});