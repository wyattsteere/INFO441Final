async function init() {
    await loadIdentity();
    await getReports();
    await getWatchTimes();
}

async function initUserProfile() {
    await loadIdentity();
    await getReports();
    console.log("User profile loading")
    await loadUserProfile();
    console.log("User profile loaded")
}

