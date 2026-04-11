const express = require("express");
const app = express();
app.use(express.json());

const accountSid = "ACxxxxxxxxxxxxxxxxxxxx";  // 👈 from Twilio
const authToken = "your_auth_token";          // 👈 from Twilio
const client = require("twilio")(accountSid, authToken);

app.post("/send-sms", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    await client.messages.create({
      body: `🔥 FIRE ALERT!\nLocation: ${lat},${lng}`,
      from: "+1XXXXXXXXXX",   // 👈 Twilio number
      to: "+251XXXXXXXXX"     // 👈 YOUR phone
    });

    res.send("SMS Sent");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.listen(3000, () => console.log("Server running"));
