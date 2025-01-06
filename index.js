const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS package

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "https://practice-2-kappa.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Handle POST request to update bus location
app.post("/update-location", (req, res) => {
  const { busId, latitude, longitude } = req.body;

  // Log the received data
  console.log(`Received location for ${busId}: ${latitude}, ${longitude}`);

  // Broadcast the location data to all connected clients (users)
  io.emit("locationUpdate", { busId, latitude, longitude });

  res.status(200).json({ message: "Location updated successfully" });
});

// Serve static files (for frontend HTML)
app.use(express.static("public"));

// Set up Socket.IO connection for real-time communication
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
