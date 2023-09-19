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
    WHERE name LIKE ?
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
                        artists.name AS artistName,
                        artists.artistId AS artistId
        FROM albums
        LEFT JOIN album_songs ON albums.id = album_songs.album_id
        LEFT JOIN songs ON album_songs.song_id = songs.id
        LEFT JOIN artists_songs ON songs.id = artists_songs.song_id
        LEFT JOIN artists ON artists_songs.artist_id = artists.id
        WHERE artists_songs.artist_id = ?;`;

  const values = [id];

  connection.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

export default artistsRouter;
