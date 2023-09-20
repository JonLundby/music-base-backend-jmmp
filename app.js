// ===== IMPORTS ===== //
import express from "express";
import cors from "cors";

// Imports from routes
//import tracksRouter from "./routes/tracks.js";
import albumsRouter from "./routes/albums.js";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());

// ROUTERS
//app.use("/tracks", tracksRouter);
app.use("/albums", albumsRouter);

// ----- MAIN GET ----- \\
app.get("/", (req, res) => {
  res.send("Node express MusicBase REST API... Running 🎉");
});

// ----- PORT LISTENER ----- \\
app.listen(port, () => {
  console.log(`app running on port: http://localhost:${port}`);
});
