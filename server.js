const express = require("express");
const app = express();
app.use(express.json());

// 🔐 Twilio credentials (REAL VALUES)
const accountSid = "ACxxxxxxxxxxxxxxxxxxxx";
const authToken = "xxxxxxxxxxxxxxxxxxxx";
const client = require("twilio")(accountSid, authToken);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("🔥 Fire System API is running");
});

// 📩 Send SMS endpoint
app.post("/send-sms", async (req, res) => {
  console.log("🔥 REQUEST:", req.body);

  const { lat, lng } = req.body;

  try {
    const time = new Date().toLocaleString();

    await client.messages.create({
      body: `🔥 FIRE ALERT!
Time: ${time}
Location: https://maps.google.com/?q=${lat},${lng}`,
      from: "+1XXXXXXXXXX",   // Twilio number
      to: "+251XXXXXXXXX"     // Your phone (verified)
    });

    res.send("SMS Sent ✅");
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).send("Error sending SMS ❌");
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
