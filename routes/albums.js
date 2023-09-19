import { Router } from "express";
import connection from "../database.js";

const albumsRouter = Router();

// get all albums (MOST LIKELY NOT WORKING PROPERLY)
// albumsRouter.get("/", (request, response) => {
//     const queryString = /*sql*/ `
//             SELECT DISTINCT albums.*,
//                 artists.name AS artistName,
//                 artists.artistID AS artistId
//             FROM albums
//             JOIN track_albums ON albums.albumID = track_albums.albumID
//             JOIN tracks ON track_albums.trackID = tracks.trackID
//             JOIN track_artists ON tracks.trackID = track_artists.trackID
//             JOIN artists ON track_artists.artistID = artists.artistID;
//     `;
//     connection.query(queryString, (error, results) => {
//       if (error) {
//         console.log(error);
//       } else {
//         response.json(results);
//       }
//     });
// });


//get single album


//get single album with songs



//CRUD
// ----- ALBUM ROUTES ----- \\
// GET all albums
albumsRouter.get("/", async (request, response) => {
  const query = "SELECT * FROM albums;";
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// GET specific album
albumsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const query = "SELECT * FROM albums WHERE albumID=?;";
  const values = [id];
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results[0]); //[0] makes the return a single object instead of array with one object
    }
  });
});

// CREATE album
albumsRouter.post("/", async (request, response) => {
  const album = request.body;
  const query = "INSERT INTO albums(albumCover, releaseDate, albumTitle, numberofTracks) values(?, ?, ?, ?);"; //todo add relevant properties
  const values = [album.albumCover, album.releaseDate, album.albumTitle, album.numberofTracks]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// UPDATE album
albumsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const album = request.body;
  const query = "UPDATE albums SET albumCover=?, releaseDate=?, albumTitle=?, numberofTracks=? WHERE albumID=?"; //todo add relevant properties
  const values = [album.albumCover, album.releaseDate, album.albumTitle, album.numberofTracks, id]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

//DELETE albums
albumsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const query = "DELETE FROM albums WHERE albumID=?;";
  const values = [id];
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// ----- EXPORTS ----- \\
export default albumsRouter;
