"use client";

import React, { useEffect, useState } from "react";
import MovieList from "@/components/MovieList/MovieList";
import { getMovieById } from "@/services/movies/getMovieById";
import { useRouter, useSearchParams } from "next/navigation";

const MyFavoritesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const MOVIES_PER_PAGE = 10;

  // Leer la página inicial desde la URL
  useEffect(() => {
    const param = Number(searchParams.get("page"));
    if (!isNaN(param) && param > 0) {
      setPage(param);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem("favoriteMovieIds");
        const favoriteIds: number[] = stored ? JSON.parse(stored) : [];

        const total = favoriteIds.length;
        const start = (page - 1) * MOVIES_PER_PAGE;
        const end = start + MOVIES_PER_PAGE;
        const currentPageIds = favoriteIds.slice(start, end);

        const data = await Promise.all(
          currentPageIds.map((id) => getMovieById(id.toString()))
        );

        setMovies(data);
        setTotalPages(Math.ceil(total / MOVIES_PER_PAGE));
      } catch (err) {
        console.error("Error loading favorites from localStorage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    router.push(`/my-favorites?page=${newPage}`);
  };

  const handleNext = () => {
    if (page < totalPages) updatePage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) updatePage(page - 1);
  };

  return (
    <div>
      <h3 className="text-3xl font-bold mb-6">My Favorite Movies (Page {page})</h3>

      {loading && (
        <h5 className="text-lg text-gray-500">Loading favorites...</h5>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          <p className="text-xl">You don’t have any favorite movies yet.</p>
          <p className="text-sm mt-2">
            Go to a movie’s detail page and click "Add to Favorites" to see it here.
          </p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <>
          <MovieList movies={movies} />
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="font-semibold">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyFavoritesPage;
