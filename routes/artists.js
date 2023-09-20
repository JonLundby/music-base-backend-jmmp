import { Router } from "express";
import connection from "../database.js";

const artistsRouter = Router();

// GET Endpoint "/tracks" - get all songs with artist information
// artistsRouter.get("/", (req, res) => {
//   const queryString = /*sql*/ `
//         SELECT tracks.trackID,
//                tracks.trackName,
//                tracks.duration,
//                GROUP_CONCAT(artists.name) AS artistNames,
//                GROUP_CONCAT(artists.artistID) AS artistIDs,
//                GROUP_CONCAT(artists.genres) AS artistGenres
//         FROM tracks
//         INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
//         INNER JOIN artists ON track_artists.artistID = artists.artistID
//         GROUP BY tracks.trackID, tracks.trackName, tracks.duration;
//     `;

//   connection.query(queryString, (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ error: "Der opstod en fejl ved forespørgslen." });
//     } else {
//       // Process the artistNames, artistIDs, and artistGenres into arrays
//       results.forEach((result) => {
//         result.artistNames = result.artistNames.split(",");
//         result.artistIDs = result.artistIDs.split(",").map(Number);
//         result.artistGenres = result.artistGenres.split(",");
//       });

//       res.json(results);
//     }
//   });
// });

// GET Endpoint "/tracks/:id" - get specific song by ID
// artistsRouter.get("/:id", (req, res) => {
//   const id = req.params.id;
//   const queryString = /*sql*/ `
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
//   const values = [id];

//   connection.query(queryString, values, (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: "Der opstod en fejl under forespørgslen." });
//     } else {
//       if (results.length === 0) {
//         res.status(404).json({ error: "Sangen blev ikke fundet." });
//       } else {
//         const trackInfo = results[0];
//         trackInfo.artistIDs = trackInfo.artistIDs.split(",").map(Number);
//         trackInfo.artistNames = trackInfo.artistNames.split(",");
//         trackInfo.artistGenres = trackInfo.artistGenres.split(",");
//         res.json(trackInfo);
//       }
//     }
//   });
// });

// ----- ARTIST ROUTES ----- \\
// GET all artists
artistsRouter.get("/", async (request, response) => {
  const query = "SELECT * FROM artists;";
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
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
  const query = "INSERT INTO artists(name, birthdate, genres, website, image, numberOfAlbums) values(?, ?, ?, ?, ?, ?);"; //todo add relevant properties
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
  const query = "UPDATE artists SET name=?, birthdate=?, genres=?, website=?, image=?, numberOfAlbums=? WHERE artistID=?"; //todo add relevant properties
  const values = [
    artist.name,
    artist.birthdate,
    artist.genres,
    artist.website,
    artist.image,
    artist.numberOfAlbums,
    id
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
