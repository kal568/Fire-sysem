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
// 🏠 HOME ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("🔥 Fire System Backend Running");
});

// =======================
// 📩 SEND SMS ENDPOINT
// =======================
app.post("/send-sms", async (req, res) => {
  const { lat, lng } = req.body;

  // validation
  if (!lat || !lng) {
    return res.status(400).send("Missing location ❌");
  }

  try {
    const time = new Date().toLocaleString();

    await client.messages.create({
      body: `🔥 FIRE ALERT!\nTime: ${time}\nLocation: https://maps.google.com/?q=${lat},${lng}`,
      from: "+1XXXXXXXXXX",
      to: "+251XXXXXXXXX"
    });

    console.log("✅ SMS sent");
    res.send("SMS Sent ✅");

  } catch (err) {
    console.error("❌ SMS error:", err.message);
    res.status(500).send("SMS Error ❌");
  }
});

// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});
