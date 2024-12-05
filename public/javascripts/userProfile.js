function showBioForm() {
    document.getElementById('edit-biography').style.display = 'block';
    document.getElementById('updateBioButton').style.display = 'none';   
}

function hideBioForm() {
    document.getElementById('edit-biography').style.display = 'none';
    document.getElementById('updateBioButton').style.display = 'inline';
}

async function updateBiography() {
    const biography = document.getElementById("biographyInput").value;
    if (!biography) {
        document.getElementById("biographyStatus").innerHTML = "Biography cannot be empty.";
        return;
    }

    try {
        const response = await fetch(`/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ biography }),
        });

        const result = await response.json();
        if (result.status === "success") {
            document.getElementById("biographyStatus").innerHTML = "Biography updated successfully.";
            hideBioForm();
        } else {
            document.getElementById("biographyStatus").innerHTML = `Error: ${result.error}`;
        }
    } catch (error) {
        console.error("Error updating biography:", error);
        document.getElementById("biographyStatus").innerHTML = "An error occurred while updating your biography.";
    }
}