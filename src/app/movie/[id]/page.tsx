"use client";

import { useEffect, useRef, useState } from "react";
import { IMovieDetail } from "@/types/MovieDetail";
import Image from "next/image";
import { getMovieById } from "@/services/movies/getMovieById";
import { getRecommendations } from "@/services/movies/getRecommendations";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { useParams } from "next/navigation";
import MovieCard from "@/components/MovieCard/MovieCard";
import Link from "next/link";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovieDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { guestSessionId } = useGuestSession();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie", err);
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const storedFavorites = localStorage.getItem("favoriteMovieIds");
    const favoriteIds: number[] = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    setIsFavorite(favoriteIds.includes(Number(id)));
  }, [id]);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchRecommendations = async () => {
      const data = await getRecommendations(id);
      setRecommendations(data || []);
    };

    fetchRecommendations();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!guestSessionId || !movie) return;

    const newFavoriteState = !isFavorite;

    try {
      await markAsFavorite(movie.id, newFavoriteState, guestSessionId);
      setIsFavorite(newFavoriteState);

      const storedFavorites = localStorage.getItem("favoriteMovieIds");
      const favoriteIds: number[] = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];

      const updatedFavorites = newFavoriteState
        ? [...new Set([...favoriteIds, movie.id])]
        : favoriteIds.filter((id) => id !== movie.id);

      localStorage.setItem(
        "favoriteMovieIds",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <div>Loading movie...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-6">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-xl w-full sm:w-64"
          width={300}
          height={450}
        />
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="italic text-slate-500">{movie.tagline}</p>
          <p>{movie.overview}</p>
          <div>
            <strong>Release:</strong> {movie.release_date.toString()}
          </div>
          <div>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </div>
          <div>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2 rounded ${isFavorite
              ? "bg-red-500 hover:bg-red-600"
              : "bg-yellow-500 hover:bg-yellow-600"
              } text-white font-bold w-max`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>

      {/* Recomendaciones con carrusel */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Recommended Movies</h3>
          <div className="relative">
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
            >
              ‹
            </button>
            <div
              ref={carouselRef}
              className="overflow-x-auto flex gap-4 scroll-smooth px-8 snap-x snap-mandatory"
            >
              {recommendations.map((movie) => (
                <div key={movie.id} className="snap-start flex-shrink-0 w-[200px]">
                  <Link href={`/movie/${movie.id}`}>
                    <MovieCard
                      title={movie.title}
                      voteAverage={movie.vote_average}
                      posterPath={movie.poster_path}
                      releaseYear={parseInt(movie.release_date?.split("-")[0])}
                      description={movie.overview}
                    />
                  </Link>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
