import { Router } from "express";
import connection from "../database.js";

const tracksRouter = Router();

// GET Endpoint "/tracks" - get all songs with artist information
tracksRouter.get("/", (req, res) => {
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
               GROUP_CONCAT(artists.artistID) AS artistID,
               GROUP_CONCAT(artists.name) AS artistName,
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
                trackInfo.artistID = trackInfo.artistID.split(",").map(Number);
                trackInfo.artistName = trackInfo.artistName.split(",");
                trackInfo.artistGenres = trackInfo.artistGenres.split(",");
                res.json(trackInfo);
            }
        }
    });
});

export default tracksRouter;
