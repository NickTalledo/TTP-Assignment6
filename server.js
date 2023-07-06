const express = require("express");
const app = express();
const port = 4000;
const movies = require("./movies");

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.get("/movies", (req, res) => {
  res.send(movies);
});

app.get("/movie/:id", (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const movie = movies.find((movie) => movie.id === movieId);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ message: "Movie not found" });
  }
});

function getNextIdFromCollection(collection) {
  if (collection.length === 0) return 1;
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

app.post("/movies", (req, res) => {
  const newMovie = {
    ...req.body,
    id: getNextIdFromCollection(movies),
  };
  console.log("newMovie", newMovie);
  movies.push(newMovie);
  res.status(201).send(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const movieUpdates = req.body;
  const movieIndex = movies.findIndex((movie) => movie.id === movieId);
  const updatedmovie = { ...movies[movieIndex], ...movieUpdates };

  if (movieIndex !== -1) {
    movies[movieIndex] = updatedmovie;
    res.send(updatedmovie);
  } else {
    res.status(404).send({ message: "Movie not found" });
  }
});

app.delete("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const movieIndex = movies.findIndex((movie) => movie.id === movieId);
  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1);
    res.send({ message: "movie deleted successfully" });
  } else {
    res.status(404).send({ message: "Movie not found" });
  }
});

module.exports = movies;
