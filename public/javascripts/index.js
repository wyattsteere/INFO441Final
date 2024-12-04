async function init() {
    await loadIdentity();
    await getReports();
    await getWatchTimes();
}
