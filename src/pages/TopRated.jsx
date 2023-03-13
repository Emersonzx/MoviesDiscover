import React, { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import "./MoviesGrid.css";
const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const TopRated = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loader = useRef(null);

  const getTopRated = async (url) => {
   const res = await fetch(url);
   const data = await res.json();
   setMovies((prevMovies) => {
     const newMovies = data.results.filter((movie) =>
       !prevMovies.some((prevMovie) => prevMovie.id === movie.id)
     );
     return [...prevMovies, ...newMovies];
   });
   setLoading(false);
 };
 

  useEffect(() => {
    const TopRatedURL = `${moviesURL}top_rated?${apiKey}&page=${page}`;
    getTopRated(TopRatedURL);
  }, [page]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const handleObserver = (entries) => {
      if (entries[0].isIntersecting && !loading) {
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading]);

  return (
    <div className="container">
      <h2 className="title">Top-rated:</h2>
      <div className="movies-container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      <div ref={loader}></div>
      <h2 className="title">Based on the TMDB API</h2>
    </div>
  );
};

export default TopRated;
