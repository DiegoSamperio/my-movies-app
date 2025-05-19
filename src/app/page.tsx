"use client";

import React, { useEffect, useState } from "react";
import { searchMovies } from "@/services/movies/searchMovies";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import { getUpcomingMovies } from "@/services/movies/getUpcomingMovies";
import { getMovieVideos } from "@/services/movies/getMovieVideos";
import MovieList from "@/components/MovieList/MovieList";
import MovieCard from "@/components/MovieCard/MovieCard";
import Link from "next/link";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const loadInitial = async () => {
      const popular = await getPopularMovies();
      if (popular.results.length > 0) {
        setFeaturedMovie(popular.results[0]);
        const trailer = await getMovieVideos(popular.results[0].id);
        const video = trailer.results.find((v: any) => v.type === "Trailer");
        setTrailerKey(video?.key || null);
      }
      const upcomingData = await getUpcomingMovies();
      setUpcoming(upcomingData.results.slice(0, 10));
    };
    loadInitial();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;
    const results = await searchMovies(searchTerm);
    setSearchResults(results.results);
  };

  return (
    <div className="space-y-10">
      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies..."
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Hero Movie */}
      {featuredMovie && (
        <div className="relative bg-gray-900 text-white p-6 rounded-xl overflow-hidden">
          <h2 className="text-4xl font-bold mb-2">{featuredMovie.title}</h2>
          <p className="max-w-xl mb-4 line-clamp-3">{featuredMovie.overview}</p>
          <Link
            href={`/movie/${featuredMovie.id}`}
            className="inline-block bg-yellow-500 px-4 py-2 rounded"
          >
            View Details
          </Link>
          {trailerKey && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Search Results</h3>
          <MovieList movies={searchResults} />
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Upcoming Movies</h3>
          <MovieList movies={upcoming} />
        </div>
      )}
    </div>
  );
};

export default HomePage;