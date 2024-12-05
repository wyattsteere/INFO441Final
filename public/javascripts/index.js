async function init() {
    await loadIdentity();
    await getReports();
    await getWatchTimes();
}

async function initUserProfile() {
    await loadIdentity();
    await getReports();
    await loadUserProfile();
}

