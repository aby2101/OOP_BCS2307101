let editIndex = null; // Track record being edited

// Function to fetch prayer times from API
async function fetchPrayerTimes() {
    const zone = document.getElementById("zoneInput").value.trim();
    if (!zone) {
        alert("Please enter a valid zone code!");
        return;
    }

    const apiUrl = `https://api.waktusolat.app/solat/${zone}`; //if find zone, fetch zone api

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        } //debug

        const data = await response.json();
        console.log("API Response:", data); // Debugging log

        if (data.status === "OK!" && Array.isArray(data.prayerTime)) {
            const todayDate = new Date().getDate(); //get today's date
            const todayPrayer = data.prayerTime[todayDate - 1]; 

            console.log("Today's Prayer Entry:", todayPrayer);

            if (todayPrayer) {
                document.getElementById("prayerTime").innerHTML = `
                    <tr><td>Day</td> <td> ${todayPrayer.day || "No Data"}</td></tr>
                    <tr><td>Hijri</td> <td> ${todayPrayer.hijri || "No Data"}</td></tr>
                    <tr><td>Fajr</td> <td> ${todayPrayer.fajr || "No Data"}</td></tr>
                    <tr><td>Dhuhr</td> <td> ${todayPrayer.dhuhr || "No Data"}</td></tr>
                    <tr><td>Asr</td> <td> ${todayPrayer.asr || "No Data"}</td></tr>
                    <tr><td>Maghrib</td> <td> ${todayPrayer.maghrib || "No Data"}</td></tr>
                    <tr><td>Isha</td> <td> ${todayPrayer.isha || "No Data"}</td></tr>
                `; //display the prayer time 

                // Store in localStorage
                localStorage.setItem("latestPrayerTime", JSON.stringify(todayPrayer));
            } else {
                document.getElementById("prayerTime").innerHTML = `<p style="color: red;">No data for today's date!</p>`;
            }
        } else {
            document.getElementById("prayerTime").innerHTML = `<p style="color: red;">Invalid zone or no data available!</p>`;
        }
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        document.getElementById("prayerTime").innerHTML = `<p style="color: red;">Error fetching prayer times. Check console.</p>`;
    }
}

// Function to save or update prayer record
function savePrayerRecord() {
    const name = document.getElementById("childName").value.trim();
    const age = document.getElementById("childAge").value.trim();
    const date = new Date().toLocaleDateString(); // Get today's date

    if (!name || !age) {
        alert("Please enter the child's name and age!"); //if no name and age entered
        return;
    }

    // Get stored prayer times
    const storedPrayerTimes = JSON.parse(localStorage.getItem("latestPrayerTime")) || {};

    // Get checkbox values
    const prayers = {
        Fajr: document.getElementById("fajr").checked ? "✓" : "✗",
        Dhuhr: document.getElementById("dhuhr").checked ? "✓" : "✗",
        Asr: document.getElementById("asr").checked ? "✓" : "✗",
        Maghrib: document.getElementById("maghrib").checked ? "✓" : "✗",
        Isha: document.getElementById("isha").checked ? "✓" : "✗",
        Sunnah: document.getElementById("sunnah").checked ? "✓" : "✗",
    };

    let prayerRecords = JSON.parse(localStorage.getItem("prayerRecords")) || [];

    if (editIndex !== null) {
        // Update existing record
        prayerRecords[editIndex] = { name, age, date, ...prayers, ...storedPrayerTimes };
        editIndex = null;
    } else {
        // Add new record
        prayerRecords.push({ name, age, date, ...prayers, ...storedPrayerTimes });
    }

    localStorage.setItem("prayerRecords", JSON.stringify(prayerRecords)); //save to localStorage

    // Reset form
    document.getElementById("childName").value = "";
    document.getElementById("childAge").value = "";
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);

    displayPrayerRecords();
}

// Function to display stored records
function displayPrayerRecords() {
    const tableBody = document.getElementById("prayerRecordsBody");
    tableBody.innerHTML = ""; // Clear previous records

    let records = JSON.parse(localStorage.getItem("prayerRecords")) || []; //get from localStorage

    records.forEach((record, index) => {
        let row = `<tr>
            <td>${record.name}</td>
            <td>${record.age}</td>
            <td>${record.date}</td>
            <td>${record.Fajr}</td>
            <td>${record.Dhuhr}</td>
            <td>${record.Asr}</td>
            <td>${record.Maghrib}</td>
            <td>${record.Isha}</td>
            <td>${record.Sunnah}</td>
            <td><button onclick="updateRecord(${index})">✏️ Update</button></td>
            <td><button onclick="deleteRecord(${index})">❌ Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Function to edit a record
function updateRecord(index) {
    let records = JSON.parse(localStorage.getItem("prayerRecords")) || [];
    let record = records[index];

    document.getElementById("childName").value = record.name;
    document.getElementById("childAge").value = record.age;
    
    Object.keys(record).forEach(prayer => {
        let checkbox = document.getElementById(prayer.toLowerCase());
        if (checkbox) checkbox.checked = record[prayer] === "✓";
    });

    editIndex = index;
}

// Function to delete a record
function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem("prayerRecords")) || [];
    records.splice(index, 1); //delete
    localStorage.setItem("prayerRecords", JSON.stringify(records));
    displayPrayerRecords();
}

// Ensure the save button works after page loads
window.onload = function() {
    document.getElementById("savePrayerRecord").addEventListener("click", savePrayerRecord);
    displayPrayerRecords();
};