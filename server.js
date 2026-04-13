const express = require("express");
const http = require("http");
const app = express();

app.use(express.json());

// 🔥 Twilio setup
const accountSid = "ACxxxxxxxxxxxxxxxxxxxx";
const authToken = "xxxxxxxxxxxxxxxxxxxx";
const client = require("twilio")(accountSid, authToken);

// 🔥 Firebase Admin SDK (SERVER SIDE)
const admin = require("firebase-admin");

// 👉 serviceAccountKey.json must be downloaded from Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🏠 Test route
app.get("/", (req, res) => {
  res.send("🔥 Fire System Backend Running");
});

// 📩 Manual SMS endpoint (still usable)
app.post("/send-sms", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const time = new Date().toLocaleString();

    await client.messages.create({
      body: `🔥 FIRE ALERT!
Time: ${time}
Location: https://maps.google.com/?q=${lat},${lng}`,
      from: "+1XXXXXXXXXX",
      to: "+251XXXXXXXXX"
    });

    res.send("SMS Sent ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("SMS Error ❌");
  }
});


// 🔴 REAL-TIME FIRE LISTENER (SERVER SIDE)
let lastCount = 0;

db.collection("alerts").onSnapshot(snapshot => {
  console.log("🔥 Fire update received:", snapshot.size);

  if (snapshot.size > lastCount) {
    console.log("🚨 NEW FIRE ALERT DETECTED!");

    snapshot.docChanges().forEach(async change => {
      if (change.type === "added") {
        const data = change.doc.data();

        if (data.lat && data.lng) {
          const time = new Date().toLocaleString();

          try {
            await client.messages.create({
              body: `🔥 FIRE ALERT!
Time: ${time}
Location: https://maps.google.com/?q=${data.lat},${data.lng}`,
              from: "+1XXXXXXXXXX",
              to: "+251XXXXXXXXX"
            });

            console.log("✅ SMS sent for new fire");
          } catch (err) {
            console.error("❌ SMS failed:", err);
          }
        }
      }
    });
  }

  lastCount = snapshot.size;
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
