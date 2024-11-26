async function getReport() {
  const responseJSON = await fetchJSON(`reports`);
  if (!responseJSON) {
    console.log("empty")
  } else {
    console.log(responseJSON);
  }
}

async function postReport() {
  const title = document.getElementById('title').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  const responseJson = await fetchJSON(`reports`, {
    method: "POST",
    body: {title: title, location: location, description: description}
  });
  console.log("inside of postreport")

  console.log(title, location, description);
}