import { Router } from "express";
//todo import db connect

const albumsRouter = Router();


//get all albums
albumsRouter.get("/", (req, res) => {
    const queryStr = /*sql*/ `
                    SELECT albums.*,
    `
});


//get single album


//get single album with songs



//CRUD
// ----- ALBUM ROUTES ----- \\
// GET all albums
albumsRouter.get("/albums", async (request, response) => {
  const query = "SELECT * FROM albums";
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// GET specific artist
albumsRouter.get("/albums/:id", async (request, response) => {
  const id = request.params.id;
  const query = "SELECT * FROM albums WHERE id=?;";
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
albumsRouter.post("/albums", async (request, response) => {
  const artist = request.body;
  const query = "INSERT INTO albums(name, birthdate) values(?, ?);"; //todo add relevant properties
  const values = [artist.name, artist.birthdate]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

// UPDATE artist
albumsRouter.put("/albums/:id", async (request, response) => {
  const id = request.params.id;
  const user = request.body;
  const query = "UPDATE albums SET name=?, birthdate=? WHERE id=?"; //todo add relevant properties
  const values = [user.name, user.birthdate, id]; //todo add relevant properties

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      response.json(results);
    }
  });
});

//DELETE albums
albumsRouter.delete("/albums/:id", async (request, response) => {
  const id = request.params.id;
  const query = "DELETE FROM albums WHERE id=?;";
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
