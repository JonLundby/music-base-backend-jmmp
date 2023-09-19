// -------------- ctr+f and search "todo" to find db deviations and other possible corrections -------------- \\
// -------------- ctr+f and search "todo" to find db deviations and other possible corrections -------------- \\
// -------------- ctr+f and search "todo" to find db deviations and other possible corrections -------------- \\

import express from "express";
import cors from "cors";
import connection from "./database.js";
import albumsRouter from "./routes/albums.js";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());
app.use("/albums", albumsRouter)

// ----- MAIN GET ----- \\
app.get("/", (req, res) => {
  res.send("hello MusicBase!");
});

// ----- ARTISTS ROUTES ----- \\
// GET all artists
app.get("/artists", async (request, response) => {
  const query = "SELECT * FROM artists";
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// GET specific artist
app.get("/artists/:id", async (request, response) => {
  const id = request.params.id;
  const query = "SELECT * FROM artists WHERE id=?;";
  const values = [id];
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results[0]); //[0] makes the return a single object instead of array with one object
    }
  });
});

// CREATE artist
app.post("/artists", async (request, response) => {
  const artist = request.body;
  const query = "INSERT INTO artists(name, birthdate) values(?, ?);"; //todo add relevant properties
  const values = [artist.name, artist.birthdate]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// UPDATE artist
app.put("/artists/:id", async (request, response) => {
  const id = request.params.id;
  const user = request.body;
  const query = "UPDATE artists SET name=?, birthdate=? WHERE id=?"; //todo add relevant properties
  const values = [user.name, user.birthdate, id]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

//DELETE artists
app.delete("/artists/:id", async (request, response) => {
  const id = request.params.id;
  const query = "DELETE FROM artists WHERE id=?;";
  const values = [id];
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// ----- PORT LISTENER ----- \\
app.listen(port, () => {
  console.log("app running on port: 3333");
});
