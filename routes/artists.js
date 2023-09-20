import { Router } from "express";
import connection from "../database.js";

const artistsRouter = Router();

// GET Endpoint "/tracks" - get all songs with artist information
artistsRouter.get("/", (req, res) => {
  const queryString = /*sql*/ `
        SELECT tracks.trackID,
               tracks.trackName,
               tracks.duration,
               GROUP_CONCAT(artists.name) AS artistNames,
               GROUP_CONCAT(artists.artistID) AS artistIDs,
               GROUP_CONCAT(artists.genres) AS artistGenres
        FROM tracks
        INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
        INNER JOIN artists ON track_artists.artistID = artists.artistID
        GROUP BY tracks.trackID, tracks.trackName, tracks.duration;
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
tracksRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  const queryString = /*sql*/ `
        SELECT tracks.trackID,
               tracks.trackName,
               tracks.duration,
               albums.albumTitle AS albumTitle,
               GROUP_CONCAT(artists.artistID) AS artistIDs,
               GROUP_CONCAT(artists.name) AS artistNames,
               GROUP_CONCAT(artists.genres) AS artistGenres
        FROM tracks
        INNER JOIN track_albums ON tracks.trackID = track_albums.trackID
        INNER JOIN albums ON track_albums.albumID = albums.albumID
        INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
        INNER JOIN artists ON track_artists.artistID = artists.artistID
        WHERE tracks.trackID = ?
        GROUP BY tracks.trackID, tracks.trackName, tracks.duration, albums.albumTitle;
    `;
  const values = [id];

  connection.query(queryString, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Der opstod en fejl under forespørgslen." });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Sangen blev ikke fundet." });
      } else {
        const trackInfo = results[0];
        trackInfo.artistIDs = trackInfo.artistIDs.split(",").map(Number);
        trackInfo.artistNames = trackInfo.artistNames.split(",");
        trackInfo.artistGenres = trackInfo.artistGenres.split(",");
        res.json(trackInfo);
      }
    }
  });
});



export default artistsRouter;

// ====================== RACE's kode ==========================
// import { Router } from "express";
// import dbConnection from "../db-connect.js";

// const artistsRouter = Router();

// // GET Endpoint "/artists" - get all artists
// artistsRouter.get("/", (request, response) => {
//   const queryString = /*sql*/ `
//     SELECT *
//     FROM artists ORDER BY name;`;

//   dbConnection.query(queryString, (error, results) => {
//     if (error) {
//       console.log(error);
//     } else {
//       response.json(results);
//     }
//   });
// });

// // GET Endpoint "/artists/search?q=taylor" - get all artists
// // Ex: http://localhost:3333/artists/search?q=cy
// artistsRouter.get("/search", (request, response) => {
//   const query = request.query.q;
//   const queryString = /*sql*/ `
//     SELECT *
//     FROM artists
//     WHERE name LIKE ?
//     ORDER BY name`;
//   const values = [`%${query}%`];
//   dbConnection.query(queryString, values, (error, results) => {
//     if (error) {
//       console.log(error);
//     } else {
//       response.json(results);
//     }
//   });
// });

// // GET Endpoint "/artists/:id" - get one artist
// artistsRouter.get("/:id", (request, response) => {
//   const id = request.params.id;
//   const queryString = /*sql*/ `
//     SELECT *
//     FROM artists WHERE id=?;`; // sql query
//   const values = [id];

//   dbConnection.query(queryString, values, (error, results) => {
//     if (error) {
//       console.log(error);
//     } else {
//       response.json(results[0]);
//     }
//   });
// });

// // GET Endpoint "/artists/:id" - get one artist
// artistsRouter.get("/:id/albums", (request, response) => {
//   const id = request.params.id;

//   const queryString = /*sql*/ `
//         SELECT DISTINCT albums.*,
//                         artists.name AS artistName,
//                         artists.id AS artistId
//         FROM albums
//         LEFT JOIN albums_songs ON albums.id = albums_songs.album_id
//         LEFT JOIN songs ON albums_songs.song_id = songs.id
//         LEFT JOIN artists_songs ON songs.id = artists_songs.song_id
//         LEFT JOIN artists ON artists_songs.artist_id = artists.id
//         WHERE artists_songs.artist_id = ?;`;

//   const values = [id];

//   dbConnection.query(queryString, values, (error, results) => {
//     if (error) {
//       console.log(error);
//     } else {
//       response.json(results);
//     }
//   });
// });

// export default artistsRouter;
