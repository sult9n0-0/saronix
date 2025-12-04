// checkSurvivor.js
const fetch = require("node-fetch"); // npm install node-fetch@2

const SURVIVOR_URL = "http://192.168.137.143:5002/check_survivor"; // Update with your IP

// Function to check detected objects
async function checkSurvivor() {
  try {
    const res = await fetch(SURVIVOR_URL);
    const data = await res.json();

    if (data.objects && data.objects.length > 0) {
      console.log("⚠️ Objects detected:", data.objects.join(", "));
    } else {
      console.log("No objects detected.");
    }
  } catch (err) {
    console.error("Error connecting to Flask server:", err.message);
  }
}

// Poll every second
setInterval(checkSurvivor, 1000);
