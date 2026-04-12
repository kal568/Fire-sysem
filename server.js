const express = require("express");
const app = express();
app.use(express.json());

// 🔐 Twilio credentials
const accountSid = "ACxxxxxxxxxxxxxxxxxxxx";
const authToken = "your_auth_token";
const client = require("twilio")(accountSid, authToken);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("🔥 Fire System API is running");
});

// 📩 Send SMS endpoint
app.post("/send-sms", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const time = new Date().toLocaleString();

    await client.messages.create({
      body: `🔥 FIRE ALERT!
Time: ${time}
Location: https://maps.google.com/?q=${lat},${lng}`,
      from: "+1XXXXXXXXXX",   // Twilio number
      to: "+251XXXXXXXXX"     // Your phone
    });

    res.send("SMS Sent ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending SMS ❌");
  }
});

// 🚀 Start server (FIXED FOR RENDER)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
