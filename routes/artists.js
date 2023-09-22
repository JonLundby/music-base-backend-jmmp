import { Router } from "express";
import connection from "../database.js";

const artistsRouter = Router();

// ----- ARTIST ROUTES ----- \\
// GET all artists
artistsRouter.get("/", async (request, response) => {
  const query = "SELECT * FROM artists;";
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      // Modify the birthdate format in the results
      const modifiedResults = results.map((artist) => ({
        ...artist,
        birthdate: artist.birthdate.toISOString().split("T")[0], // Remove time and "Z"
      }));

      response.json(modifiedResults);
    }
  });
});

// GET specific artist
artistsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const query = "SELECT * FROM artists WHERE artistID=?;";
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
artistsRouter.post("/", async (request, response) => {
  const artist = request.body;
  console.log(artist);
  const query =
    "INSERT INTO artists(name, birthdate, genres, website, image, numberOfAlbums) values(?, ?, ?, ?, ?, ?);"; //todo add relevant properties
  const values = [artist.name, artist.birthdate, artist.genres, artist.website, artist.image, artist.numberOfAlbums]; //todo add relevant properties
  console.log(values);
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// UPDATE artist
artistsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const artist = request.body;
  console.log(artist);
  const query =
    "UPDATE artists SET name=?, birthdate=?, genres=?, website=?, image=?, numberOfAlbums=? WHERE artistID=?"; //todo add relevant properties
  const values = [
    artist.name,
    artist.birthdate,
    artist.genres,
    artist.website,
    artist.image,
    artist.numberOfAlbums,
    id,
  ]; //todo add relevant properties
  console.log(values);

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

//DELETE artist
artistsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const query = "DELETE FROM artists WHERE artistID=?;";
  const values = [id];
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

export default artistsRouter;