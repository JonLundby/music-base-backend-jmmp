import { Router } from "express";
import connection from "../database.js";

const tracksRouter = Router();

// GET Endpoint "/tracks" - get all songs with artist information
tracksRouter.get("/", (req, res) => {
    const queryString = /*sql*/ `
        SELECT tracks.trackID,
            tracks.trackName,
            tracks.duration,
            artists.name AS artistName,
            artists.artistID AS artistID,
            artists.genres AS artistGenres
        FROM tracks
        INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
        INNER JOIN artists ON track_artists.artistID = artists.artistID;  
    `;

    connection.query(queryString, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Der opstod en fejl ved forespørgslen." });
        } else {
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
               artists.artistID AS artistID,
               artists.name AS artistName,
               artists.genres AS artistGenres
        FROM tracks
        INNER JOIN track_albums ON tracks.trackID = track_albums.trackID
        INNER JOIN albums ON track_albums.albumID = albums.albumID
        INNER JOIN album_artists ON albums.albumID = album_artists.albumID
        INNER JOIN artists ON album_artists.artistID = artists.artistID
        WHERE tracks.trackID = ?;
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
                res.json(results[0]);
            }
        }
    });
});

export default tracksRouter;
