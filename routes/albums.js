import { Router } from "express";
import connection from "../database.js";

const albumsRouter = Router();

// ----- ALBUM ROUTES ----- \\
// GET Endpoint "/albums" - get all albums with artist information
albumsRouter.get("/", (req, res) => {
  const queryString = /*sql*/ `
        SELECT albums.albumID,
               albums.albumCover,
               albums.releaseDate,
               albums.albumTitle,
               albums.numberofTracks,
               GROUP_CONCAT(tracks.trackName) AS trackNames,
               GROUP_CONCAT(tracks.trackID) AS trackIDs
        FROM albums
        INNER JOIN track_albums ON albums.albumID = track_albums.albumID
        INNER JOIN tracks ON track_albums.trackID = tracks.trackID
        GROUP BY albums.albumID, albums.albumCover, albums.releaseDate, albums.albumTitle, albums.numberofTracks;
    `;

  connection.query(queryString, (err, results) => {
    console.log(results)
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Der opstod en fejl ved forespørgslen." });
    } else {
      // Process the artistNames, artistIDs, and artistGenres into arrays
      results.forEach((result) => {
        result.trackNames = result.trackNames.split(",");
        result.trackIDs = result.trackIDs.split(",").map(Number);
        //result.artistGenres = result.artistGenres.split(",");
      });

      res.json(results);
    }
  });
});

// GET Endpoint "/albums/:id" - get specific album by ID
albumsRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const queryString = /*sql*/ `
        SELECT albums.albumID,
               albums.albumCover,
               albums.releaseDate,
               albums.albumTitle,
               albums.numberofTracks,
               GROUP_CONCAT(tracks.trackName) AS trackNames,
               GROUP_CONCAT(tracks.trackID) AS trackIDs
        FROM albums
        INNER JOIN track_albums ON albums.albumID = track_albums.albumID
        INNER JOIN tracks ON track_albums.trackID = tracks.trackID
        WHERE albums.albumID = ?
        GROUP BY albums.albumID, albums.albumCover, albums.releaseDate, albums.albumTitle, albums.numberofTracks;
    `;
    const values = [id];

  connection.query(queryString, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Der opstod en fejl under forespørgslen." });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: "Albummet blev ikke fundet." });
            } else {
                const albumInfo = results[0];
                albumInfo.trackIDs = albumInfo.trackIDs.split(",").map(Number);
                albumInfo.trackNames = albumInfo.trackNames.split(",");
                res.json(albumInfo);
            }
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


// GET all albums
// albumsRouter.get("/", async (request, response) => {
//   const query = "SELECT * FROM albums;";
//   connection.query(query, (err, results, fields) => {
//     if (err) {
//       console.log(err);
//     } else {
//       response.json(results);
//     }
//   });
// });

// GET specific album
// albumsRouter.get("/:id", async (request, response) => {
//   const id = request.params.id;
//   const query = "SELECT * FROM albums WHERE albumID=?;";
//   const values = [id];
//   connection.query(query, values, (err, results, fields) => {
//     if (err) {
//       console.log(err);
//     } else {
//       response.json(results[0]); //[0] makes the return a single object instead of array with one object
//     }
//   });
// });

// ----- EXPORTS ----- \\
export default albumsRouter;
