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

//############ get albums test start ############ \\
// GET Endpoint "/albums" - get all albums with artist information
albumsRouter.get("/", (req, res) => {
  const queryString = /*sql*/ `
        SELECT albums.albumID,
               albums.albumCover,
               albums.releaseDate,
               albums.albumTitle,
               albums.numberofTracks,
               GROUP_CONCAT(artists.name) AS artistNames,
               GROUP_CONCAT(artists.artistID) AS artistIDs,
               GROUP_CONCAT(artists.genres) AS artistGenres
        FROM albums
        INNER JOIN album_artists ON albums.albumID = album_artists.albumID
        INNER JOIN artists ON album_artists.artistID = artists.artistID
        GROUP BY albums.albumID, albums.albumCover, albums.releaseDate, albums.albumTitle, albums.numberofTracks;
    `;

  connection.query(queryString, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Der opstod en fejl ved forespørgslen." });
    } else {
      // Process the artistNames, artistIDs, and artistGenres into arrays
      results.forEach((result) => {
        result.artistNames = result.artistNames.split(",");
        result.artistIDs = result.artistIDs.split(",").map(Number);
        result.artistGenres = result.artistGenres.split(",");
      });

      res.json(results);
    }
  });
});

// GET Endpoint "/tracks/:id" - get specific song by ID
// tracksRouter.get("/:id", (req, res) => {
//     const id = req.params.id;
//     const queryString = /*sql*/ `
//         SELECT tracks.trackID,
//                tracks.trackName,
//                tracks.duration,
//                albums.albumTitle AS albumTitle,
//                GROUP_CONCAT(artists.artistID) AS artistIDs,
//                GROUP_CONCAT(artists.name) AS artistNames,
//                GROUP_CONCAT(artists.genres) AS artistGenres
//         FROM tracks
//         INNER JOIN track_albums ON tracks.trackID = track_albums.trackID
//         INNER JOIN albums ON track_albums.albumID = albums.albumID
//         INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
//         INNER JOIN artists ON track_artists.artistID = artists.artistID
//         WHERE tracks.trackID = ?
//         GROUP BY tracks.trackID, tracks.trackName, tracks.duration, albums.albumTitle;
//     `;
//     const values = [id];

//     connection.query(queryString, values, (err, results) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: "Der opstod en fejl under forespørgslen." });
//         } else {
//             if (results.length === 0) {
//                 res.status(404).json({ error: "Sangen blev ikke fundet." });
//             } else {
//                 const trackInfo = results[0];
//                 trackInfo.artistIDs = trackInfo.artistIDs.split(",").map(Number);
//                 trackInfo.artistNames = trackInfo.artistNames.split(",");
//                 trackInfo.artistGenres = trackInfo.artistGenres.split(",");
//                 res.json(trackInfo);
//             }
//         }
//     });
// });

//############ get albums test slut ############ \\

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
