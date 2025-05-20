"use client";

import React, { Suspense, useEffect, useState } from "react";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import MovieList from "@/components/MovieList/MovieList";
import { useRouter, useSearchParams } from "next/navigation";

const PopularContent = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const pageFromURL = Number(searchParams.get("page"));
    if (!isNaN(pageFromURL) && pageFromURL > 0) {
      setPage(pageFromURL);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      const data = await getPopularMovies(page);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    };

    fetchPopularMovies();
  }, [page]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    router.push(`/popular?page=${newPage}`);
  };

  const handleNext = () => {
    if (page < totalPages) updatePage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) updatePage(page - 1);
  };

  return (
    <div>
      <h3 className="text-3xl font-bold mb-6">Popular Movies (Page {page})</h3>
      {loading && <p>Cargando...</p>}
      <MovieList movies={movies} />
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span className="font-semibold">Página {page} de {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default function PopularClientPage() {
  return (
    <Suspense fallback={<p className="text-center">Cargando...</p>}>
      <PopularContent />
    </Suspense>
  );
}
