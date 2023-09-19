import { Router } from "express";
import connection from "../database.js";

const tracksRouter = Router();

// ROUTER GET "/tracks" - get all tracks
tracksRouter.get("/", (req, res) => {
    const queryString = /*sql*/ `
        SELECT tracks.*,
            artists.name AS artistName,
            artists.artistId AS artistId,
            artists.genres AS artistGenre
        FROM tracks
        INNER JOIN albums ON tracks.albumId = albums.albumId
        INNER JOIN artists ON albums.artistId = artists.artistId;  
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

// ROUTER GET "/tracks/:id" - get specific song
tracksRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const queryString = /*sql*/ `
        SELECT tracks.*,
            albums.albumTitle AS albumTitle,
            artists.name AS artistName,
            artists.artistId AS artistId,
            artists.genres AS artistGenre
        FROM tracks
        INNER JOIN albums ON tracks.albumId = albums.albumId
        INNER JOIN artists ON albums.artistId = artists.artistId
        WHERE tracks.trackId = ?;
    `;
    const values = [id];

    connection.query(queryString, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Der opstid en fejl ved forespørgslen." });
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
