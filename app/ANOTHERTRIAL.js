async function getDistance() {
    try {
        const res = await fetch("http://192.168.137.143:5000/distance");

        if (!res.ok) {
            throw new Error("HTTP Error " + res.status);
        }

        const data = await res.json();

        console.log(`Distance: ${data.distance_cm !== null ? data.distance_cm.toFixed(2) + " cm" : "null"}`);
        console.log(`Obstacle detected? ${data.obstacle ? "⚠️ Yes" : "✅ No"}`);
        console.log('-----------------------');

    } catch (err) {
        console.error("❌ Failed to fetch distance:", err);
    }
}

setInterval(getDistance, 300);
