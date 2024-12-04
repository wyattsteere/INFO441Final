window.onload = getWatchTimes;

async function getWatchTimes() {
  const watchContainer = document.getElementById('watchContainer');
  const watchForm = document.getElementById('watchForm');
  const watchHeader = document.getElementById('watchHeader'); // The "Sign Up for a Watch" header

  try {
      const identityResponse = await fetch('/api/v1/users/myIdentity');
      const identity = await identityResponse.json();
      const isLoggedIn = identity.status === "loggedin";

      if (isLoggedIn) {
          console.log("User is logged in:", identity.userInfo.username);
          watchForm.style.display = 'block';
          watchHeader.style.display = 'block';
      } else {
          console.log("User is not logged in.");
          watchForm.style.display = 'none';
          watchHeader.style.display = 'none';
      }

      const response = await fetch('/watchs/time');
      const watchTimes = await response.json();

      if (!watchTimes || watchTimes.length === 0) {
          watchContainer.innerHTML = '<p>No watches found.</p>';
          return;
      }

      watchContainer.innerHTML = watchTimes.map(watch => `
          <div class="watch-time">
              <h3>${escapeHTML(watch.description)}</h3>
              <p><strong>Location:</strong> ${escapeHTML(watch.location)}</p>
              <p><strong>Date:</strong> ${escapeHTML(new Date(watch.watch_date).toLocaleDateString())}</p>
              <p><strong>Time:</strong> ${escapeHTML(watch.time_start)} - ${escapeHTML(watch.time_end)}</p>
              ${!isLoggedIn ? `<p><strong>Username:</strong> ${escapeHTML(watch.username)}</p>` : ''}
          </div>
          <hr>
      `).join('');
  } catch (error) {
      console.error("Error loading watch times:", error);
      watchContainer.innerHTML = '<p class="error">Error loading watch times. Please try again later.</p>';
  }
}
async function postWatch() {
  const description = document.getElementById('watchDescription').value;
  const location = document.getElementById('watchLocation').value;
  const watch_date = document.getElementById('watchDate').value;
  const time_start = document.getElementById('watchTimeStart').value;
  const time_end = document.getElementById('watchTimeEnd').value;

  const feedbackContainer = document.getElementById('watchFeedbackMessage');
  feedbackContainer.style.display = 'none'; // Hide feedback initially

  if (!description || !location || !watch_date || !time_start || !time_end) {
      feedbackContainer.innerHTML = '<p class="error">Please fill out all fields.</p>';
      feedbackContainer.style.display = 'block';
      return;
  }

  try {
      const response = await fetch('/watchs/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              description,
              location,
              watch_date,
              time_start,
              time_end
          }),
      });

      if (response.status === 401) {
          feedbackContainer.innerHTML = '<p class="error">Error: You must be logged in to sign up for a watch.</p>';
          feedbackContainer.style.display = 'block';
          return;
      }

      const result = await response.json();

      if (result.status === 'success') {
          feedbackContainer.innerHTML = '<p class="success">Watch signup successful!</p>';
          feedbackContainer.style.display = 'block';
          document.getElementById('watchForm').reset();
          getWatchTimes();
      } else {
          feedbackContainer.innerHTML = `<p class="error">Error: ${escapeHTML(result.error)}</p>`;
          feedbackContainer.style.display = 'block';
      }
  } catch (error) {
      console.error('Error submitting watch time:', error);
      feedbackContainer.innerHTML = '<p class="error">An error occurred while submitting the watch time.</p>';
      feedbackContainer.style.display = 'block';
  }
}