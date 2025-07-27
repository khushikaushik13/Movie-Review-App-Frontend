import './App.css';
import api from './API/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState();

  const getMovies = async () => {
    try {
      const response = await api.get("/api/v1/movies");
      setMovies(response.data);
      console.log("Fetched movies:", response.data);
    } catch (err) {
      console.log("Error fetching movies:", err);
    }
  };

  const getMovieData = async (movieId) => {
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);

      const singleMovie = response.data;

      setMovie(singleMovie);

      setReviews()

    } catch (error) {
      
    }
  }

  const fetchReviews = async (imdbId) => {
  try {
    console.log("Fetching movie data for reviews:", imdbId);

    const movieResponse = await api.get(`/api/v1/movies/${imdbId}`);
    const reviewIds = movieResponse.data.reviewIds;

    console.log("Review IDs found in movie:", reviewIds);

    if (!reviewIds || reviewIds.length === 0) {
      console.log("No review IDs found.");
      setReviews([]);
      return;
    }

    const reviewResponses = await Promise.all(
      reviewIds.map((id) =>
        axios.get(`https://e25fa662b590.ngrok-free.app/api/v1/reviews/${id}`)
      )
    );

    const allReviews = reviewResponses.map((res) => res.data);

    console.log("Fetched reviews:", allReviews);

    setReviews(allReviews.reverse());
  } catch (error) {
    console.error("Error fetching reviews:", error);
    setReviews([]);
  }
};



  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Layout with Home inside */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home movies={movies} />} />
        </Route>

        {/* Separate route for Trailer */}
        <Route path="/Trailer/:ytTrailerId" element={<Trailer />} />
        <Route path="/Reviews/:moviesId" element={<Reviews getMovieData={getMovieData} movie={movie} reviews={reviews} setReviews={setReviews} fetchReviews={fetchReviews}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
