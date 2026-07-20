const closeBtn = document.getElementById("closeModal");
const createBtn = document.getElementById("createBugBtn");
const modal = document.getElementById("bugModal");
const saveBtn = document.getElementById("saveBug");
const tbody = document.getElementById("bugTableBody");
const statusModal = document.getElementById("statusModal");
const closeStatusModal = document.getElementById("closeStatusModal");

let selectedBugId = null;


createBtn.addEventListener("click", () => {

    modal.style.display = "block";

});


closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});


// Load bugs from backend
async function loadBugs() {

    const response = await fetch("http://localhost:3000/api/bugs");

    const bugs = await response.json();

    tbody.innerHTML = "";


    bugs.forEach(bug => {

        const row = tbody.insertRow();

        row.innerHTML = `
            <td>BUG-${bug.id}</td>

            <td>${bug.title}</td>

            <td>${bug.priority}</td>

            <td>
                <span 
    data-cy="bug-status"
    class="status-badge status-${bug.status.toLowerCase()}"
    onclick="changeStatus(${bug.id}, '${bug.status}')">
    ${bug.status}
</span>
            </td>

            <td>

                <button onclick="deleteBug(${bug.id})">
                    Delete
                </button>

            </td>
        `;

    });

}



// Create new bug
saveBtn.addEventListener("click", async () => {

    const title = document.getElementById("bugTitle").value;
    const priority = document.getElementById("priority").value;


    if (title.trim() === "") {

        alert("Bug title is required");
        return;

    }


    try {

        const response = await fetch("http://localhost:3000/api/bugs", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title: title,
                priority: priority

            })

        });


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);
            return;

        }


        modal.style.display = "none";

        document.getElementById("bugTitle").value = "";


        // Reload bug list after changes
       loadBugs();
loadDashboardStats();


    } catch (error) {

        console.error(error);
        alert("Server error");

    }

});




// Delete bug
async function deleteBug(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this bug?"
    );


    if (!confirmed) {

        return;

    }


    const response = await fetch(
        `http://localhost:3000/api/bugs/${id}`,
        {
            method: "DELETE"
        }
    );


    if (response.ok) {

        loadBugs();
loadDashboardStats();

    }

}



// Change bug status
function changeStatus(id, currentStatus) {

    selectedBugId = id;

    statusModal.style.display = "block";

}

closeStatusModal.addEventListener("click", () => {

    statusModal.style.display = "none";

});



async function selectStatus(status) {

     console.log("Selected bug:", selectedBugId);
    console.log("New status:", status);

    const confirmed = confirm(
        `Are you sure you want to change status to ${status}?`
    );


    if (!confirmed) {

        return;

    }

console.log("Sending PUT request...");

    const response = await fetch(
        `http://localhost:3000/api/bugs/${selectedBugId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })

        }
    );


    if (response.ok) {

        statusModal.style.display = "none";

        loadBugs();
loadDashboardStats();

    }

}

// Load dashboard statistics
async function loadDashboardStats() {

    try {

        const bugsResponse = await fetch(
            "http://localhost:3000/api/bugs"
        );

        const bugs = await bugsResponse.json();


        document.getElementById("totalBugs").innerText = bugs.length;


        const openBugs = bugs.filter(
            bug => bug.status === "OPEN"
        ).length;


        document.getElementById("openBugs").innerText = openBugs;



        const statusResponse = await fetch(
            "http://localhost:3000/api/status"
        );

        const status = await statusResponse.json();


document.getElementById("systemStatus").innerText = "🟢 " + status.status;

    } catch(error) {

        console.error(error);

        document.getElementById("systemStatus").innerText = "ERROR";

    }

}



// Initial load
loadBugs();
loadDashboardStats();