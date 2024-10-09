require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const twilio = require("twilio");

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(express.json()); // To parse JSON bodies

const server = http.createServer(app);
const io = socketIo(server);

// Example Twilio endpoint
app.post("/sendSMS", (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      body: message,
      from: "+1234567890", // Replace with your Twilio phone number
      to: to, // The recipient's phone number
    })
    .then((message) => res.send({ success: true, messageSid: message.sid }))
    .catch((error) => res.send({ success: false, error: error.message }));
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a dynamic room (based on emergencyId)
  socket.on("joinEmergencyRoom", (emergencyId) => {
    socket.join(emergencyId);
    console.log(`Client joined room: ${emergencyId}`);
  });

  // Listen for location updates from the user
  socket.on("locationUpdate", (data) => {
    const { emergencyId, location } = data;
    console.log(`Location update in room ${emergencyId}:`, location);

    // Broadcast the location update to volunteers in the same room
    io.to(emergencyId).emit("locationUpdate", location);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
