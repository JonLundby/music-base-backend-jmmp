import { Router } from "express";
import connection from "../database.js";

const artistsRouter = Router();

// GET Endpoint "/artists" - get all artists
artistsRouter.get("/artists", (request, response) => {
  const queryString = /*sql*/ `
    SELECT * 
    FROM artists
    ORDER BY name;`;

  connection.query(queryString, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// GET Endpoint "/artists/search?q=taylor" - get all artists
artistsRouter.get("/search", (request, response) => {
  const query = request.query.q.toLocaleLowerCase();
  const queryString = /*sql*/ `
    SELECT * 
    FROM artists
    WHERE artistName LIKE ?
    ORDER BY name`;
  const values = [`%${query}%`];
  connection.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// GET Endpoint "/artists/:id" - get one artist
artistsRouter.get("/:artistId", (request, response) => {
  const id = request.params.artistId;
  const queryString = /*sql*/ `
    SELECT * 
    FROM artists WHERE artistId=?;`; // sql query
  const values = [id];

  connection.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results[0]);
    }
  });
});

// GET Endpoint "/artists/:id" - get one artist album?
artistsRouter.get("/:artistId/albums", (request, response) => {
  const id = request.params.id;

  const queryString = /*sql*/ `
        SELECT DISTINCT albums.*,
                        artists.artistName AS artistName,
                        artists.artistId AS artistId
        FROM albums
        JOIN album_song ON albums.albumID = album_song.albumId
        JOIN songs ON album_song.songId = songs.songID
        JOIN artist_song ON songs.songID = artist_song.songId
        JOIN artists ON artist_song.artistId = artists.artistID
        WHERE artist_song.artistId = ?;`;

  const values = [id];

  console.log(queryString);
  connection.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      response.json(results);
    }
  });
});

// Skal nedenstående ikke også være i denne mappe?

// CREATE artist
artistsRouter.post("/artists", async (request, response) => {
  const artist = request.body;
  const query = "INSERT INTO artists(artistName) values(?);"; //todo add relevant properties
  const values = [artist.artistName]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// UPDATE artist
artistsRouter.put("/artists/:artistId", async (request, response) => {
  const id = request.params.artistId;
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
artistsRouter.delete("/artists/:artistId", async (request, response) => {
  const id = request.params.artistId;
  const query = "DELETE FROM artists WHERE artistId=?;";
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
