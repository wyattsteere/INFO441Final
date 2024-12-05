async function init() {
    await loadIdentity();
    await getReports();
    await getWatchTimes();
    await loadCalendar();
}

async function initUserProfile() {
    await loadIdentity();
    await getReports();
    await loadUserProfile();
}

