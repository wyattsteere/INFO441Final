window.onload = getReports;

async function getReports() {
  try {
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('user');
      let response = null;
    if (username != undefined) {
        response = await fetch(`/reports?username=${username}`);
    } else {
        response = await fetch(`/reports`);
    }
      const reports = await response.json();
      console.log(reports)

      const reportsContainer = document.getElementById('reportsContainer');

      if (!reports || reports.length === 0) {
          reportsContainer.innerHTML = '<p>No reports found.</p>';
          return;
      }

      reportsContainer.innerHTML = reports.map(report => `
          <div class="report">
              <h3>${escapeHTML(report.title)}</h3>
              <p><strong>Location:</strong> ${escapeHTML(report.location)}</p>
              <p><strong>Description:</strong> ${escapeHTML(report.description)}</p>
          </div>
          <hr>
      `).join('');
  } catch (error) {
      console.error('Error loading reports:', error);
      document.getElementById('reportsContainer').innerHTML = '<p>Error loading reports. Please try again later.</p>';
  }
}

async function postReport() {
  const title = document.getElementById('title').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  const response = await fetch('/reports', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, location, description }),
  });

  const result = await response.json();

  if (result.status === 'success') {
      document.getElementById('feedbackMessage').style.display = 'block';
      document.getElementById('reportForm').reset();
      getReports();
  }
}