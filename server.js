const express = require("express");
const app = express();

app.use(express.json());

// =======================
// 🔥 TWILIO SETUP
// =======================
const accountSid = "ACxxxxxxxxxxxxxxxxxxxx";
const authToken = "xxxxxxxxxxxxxxxxxxxx";
const client = require("twilio")(accountSid, authToken);

// =======================
// 🔥 FIREBASE ADMIN SDK
// =======================
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// =======================
// 🏠 TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("🔥 Fire System Backend Running");
});

// =======================
// 📩 MANUAL SMS ENDPOINT
// =======================
app.post("/send-sms", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const time = new Date().toLocaleString();

    await client.messages.create({
      body: `🔥 FIRE ALERT!\nTime: ${time}\nLocation: https://maps.google.com/?q=${lat},${lng}`,
      from: "+1XXXXXXXXXX",
      to: "+251XXXXXXXXX"
    });

    res.send("SMS Sent ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("SMS Error ❌");
  }
});

// =======================
// 🔴 REAL-TIME FIRE LISTENER
// =======================
let lastCount = 0;

db.collection("alerts").onSnapshot(snapshot => {
  console.log("🔥 Fire update:", snapshot.size);

  if (snapshot.size > lastCount) {
    console.log("🚨 NEW FIRE ALERT!");

    snapshot.docChanges().forEach(async change => {
      if (change.type === "added") {
        const data = change.doc.data();

        if (data.lat && data.lng) {
          const time = new Date().toLocaleString();

          try {
            await client.messages.create({
              body: `🔥 FIRE ALERT!\nTime: ${time}\nLocation: https://maps.google.com/?q=${data.lat},${data.lng}`,
              from: "+1XXXXXXXXXX",
              to: "+251XXXXXXXXX"
            });

            console.log("✅ SMS sent");
          } catch (err) {
            console.error("❌ SMS failed:", err);
          }
        }
      }
    });
  }

  lastCount = snapshot.size;
});

// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});
