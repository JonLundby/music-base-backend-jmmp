import { Router } from "express";
import connection from "../database.js";

const tracksRouter = Router();

// GET Endpoint "/tracks" - get all songs with artist information
tracksRouter.get("/", (req, res) => {
    const queryString = /*sql*/ `
        SELECT tracks.trackID,
               tracks.trackName,
               tracks.duration,
               albums.albumID AS albumID,  -- Include albumID in the SELECT statement
               GROUP_CONCAT(artists.name) AS artistNames,
               GROUP_CONCAT(artists.artistID) AS artistIDs,
               GROUP_CONCAT(artists.genres) AS artistGenres
        FROM tracks
        INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
        INNER JOIN track_albums ON tracks.trackID = track_albums.trackID
        INNER JOIN albums ON track_albums.albumID = albums.albumID
        INNER JOIN artists ON track_artists.artistID = artists.artistID
        GROUP BY tracks.trackID, tracks.trackName, tracks.duration, albums.albumID;
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
// GET Endpoint "/tracks/:id" - get specific song by ID
tracksRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const queryString = /*sql*/ `
        SELECT tracks.trackID,
               tracks.trackName,
               tracks.duration,
               albums.albumTitle AS albumTitle,
               albums.albumID AS albumID,  -- Include albumID in the SELECT statement
               GROUP_CONCAT(artists.artistID) AS artistIDs,
               GROUP_CONCAT(artists.name) AS artistNames,
               GROUP_CONCAT(artists.genres) AS artistGenres
        FROM tracks
        INNER JOIN track_albums ON tracks.trackID = track_albums.trackID
        INNER JOIN albums ON track_albums.albumID = albums.albumID
        INNER JOIN track_artists ON tracks.trackID = track_artists.trackID
        INNER JOIN artists ON track_artists.artistID = artists.artistID
        WHERE tracks.trackID = ?
        GROUP BY tracks.trackID, tracks.trackName, tracks.duration, albums.albumTitle, albums.albumID;
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

// PUT Endpoint "/tracks/:id" - update specific song by ID
tracksRouter.put("/:id", (req, res) => {
    // Start en SQL-transaktion
    connection.beginTransaction((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Fejl ved oprettelse af nye sang-kunstnerrelationer." });
            return;
        }

        const trackID = req.params.id;
        const { trackName, duration, artistIDs } = req.body;

        // Først opdaterer vi sangens oplysninger
        const updateTrackQuery = /*sql*/ `
      UPDATE tracks
      SET trackName = ?, duration = ?
      WHERE trackID = ?;
    `;

        connection.query(updateTrackQuery, [trackName, duration, trackID], (err, results) => {
            if (err) {
                console.error(err);
                // Rul transaktionen tilbage i tilfælde af en fejl
                connection.rollback(() => {
                    res.status(500).json({ error: "Fejl ved opdatering af sangoplysninger." });
                });
                return;
            }

            // Slet alle eksisterende relationer mellem sangen og kunstnerne, der ikke er inkluderet i PUT-anmodningen
            const deleteTrackArtistsQuery = /*sql*/ `
        DELETE FROM track_artists
        WHERE trackID = ? AND artistID NOT IN (?);
      `;

            connection.query(deleteTrackArtistsQuery, [trackID, artistIDs], (err, results) => {
                if (err) {
                    console.error(err);
                    // Rul transaktionen tilbage i tilfælde af en fejl
                    connection.rollback(() => {
                        res.status(500).json({ error: "Fejl ved sletning af kunstnerrelationer." });
                    });
                    return;
                }

                // Nu indsætter vi de nye relationer mellem sangen og kunstnerne
                const insertTrackArtistsQuery = /*sql*/ `
          INSERT IGNORE INTO track_artists (trackID, artistID)
          VALUES (?, ?);
        `;

                // Brug løkke til at indsætte relationer for hvert artistID i PUT-anmodningen
                artistIDs.forEach((artistID) => {
                    connection.query(insertTrackArtistsQuery, [trackID, artistID], (err, results) => {
                        if (err) {
                            console.error(err);
                            // Ignorer duplikatindsættelsesfejl, men log andre fejl
                            if (err.code !== "ER_DUP_ENTRY") {
                                // Rul transaktionen tilbage i tilfælde af en fejl
                                connection.rollback(() => {
                                    res.status(500).json({
                                        error: "Fejl ved oprettelse af nye sang-kunstnerrelationer.",
                                    });
                                });
                                return;
                            }
                        }
                    });
                });

                // Udfør transaktionen
                connection.commit((err) => {
                    if (err) {
                        console.error(err);
                        // Rul transaktionen tilbage i tilfælde af en fejl
                        connection.rollback(() => {
                            res.status(500).json({ error: "Fejl ved gennemførelse af transaktionen." });
                        });
                        return;
                    }

                    res.json({ message: "Sangen blev opdateret med succes." });
                });
            });
        });
    });
});

// DELETE Endpoint "/tracks/:id" - delete specific song by ID
tracksRouter.delete("/:id", (req, res) => {
    const id = req.params.id;

    // 1. Slet alle relationer til sangen fra track_artists-tabellen
    const deleteTrackArtistsQuery = /*sql*/ `
        DELETE FROM track_artists
        WHERE trackID = ?;
    `;

    connection.query(deleteTrackArtistsQuery, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Der opstod en fejl ved sletning af sang-kunstnerrelationer." });
        } else {
            // 2. Slet alle relationer til sangen fra track_albums-tabellen
            const deleteTrackAlbumsQuery = /*sql*/ `
                DELETE FROM track_albums
                WHERE trackID = ?;
            `;

            connection.query(deleteTrackAlbumsQuery, [id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Der opstod en fejl ved sletning af sang-albumrelationer." });
                } else {
                    // 3. Slet sangen fra tracks-tabellen
                    const deleteTrackQuery = /*sql*/ `
                        DELETE FROM tracks
                        WHERE trackID = ?;
                    `;

                    connection.query(deleteTrackQuery, [id], (err, result) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({ error: "Der opstod en fejl ved sletning af sangen." });
                        } else {
                            if (result.affectedRows === 0) {
                                res.status(404).json({ error: "Sangen blev ikke fundet." });
                            } else {
                                // 4. Send en bekræftelsesbesked
                                res.json({ message: "Sangen blev slettet med succes." });
                            }
                        }
                    });
                }
            });
        }
    });
});

export default tracksRouter;
