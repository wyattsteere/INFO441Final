let myIdentity = undefined;

async function loadIdentity() {
    let identity_div = document.getElementById("identity_div");

    try {
        let identityInfo = await fetchJSON(`api/${apiVersion}/users/myIdentity`)

        if (identityInfo.status == "loggedin") {
            myIdentity = identityInfo.userInfo.username;
            identity_div.innerHTML = `
            <a href="/userInfo.html?user=${encodeURIComponent(identityInfo.userInfo.username)}">${escapeHTML(identityInfo.userInfo.name)} (${escapeHTML(identityInfo.userInfo.username)})</a>
            <a href="signout" class="btn btn-danger" role="button">Log out</a>`;
        } else { //logged out
            myIdentity = undefined;
            identity_div.innerHTML = `
            <a href="signin" class="btn btn-primary" role="button">Log in</a>`;

        }
    } catch (error) {
        myIdentity = undefined;
        identity_div.innerHTML = `<div>
        <button onclick="loadIdentity()">retry</button>
        Error loading identity: <span id="identity_error_span"></span>
        <a href="signout" class="btn btn-danger" role="button">Log out</a>
        <a href="signin" class="btn btn-primary" role="button">Log in</a>
        </div>`;
        document.getElementById("identity_error_span").innerText = error;
    }
}

async function loadUserProfile() {
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('user');
    if (!username) {
        document.getElementById('user-info').innerHTML = `<p>Error: No User Specified </p>`;
        return;
    }

    try {
        const response = await fetch(`/users?user=${encodeURIComponent(username)}`);
        const userData = await response.json();
        console.log("User data for profile page:", userData);
        if (userData.status === 'error') {
            document.getElementById('user-info').innerHTML = `<p>Error: ${userData.error}</p>`
        }

        document.getElementById('user-info').innerHTML = `
            <h2>${escapeHTML(userData.username)}'s Profile</h2>
            <p><strong>Biography:</strong> ${escapeHTML(userData.biography)}</p>
            <p><strong>Account Created:</strong> ${new Date(userData.accountCreation).toLocaleDateString()}</p>
            <p><strong>Crimes Reported:</strong> ${userData.crimesReported || 0}</p>`
        document.getElementById('profile-name-reports').innerText = `${username}'s Reports`
    } catch (error) {
        console.error('Error fetching user data:', error);
        document.getElementById('user-info').innerHTML = '<p>Error loading user profile.</p>';
    }
}