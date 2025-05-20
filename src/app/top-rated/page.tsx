"use client";

import React, { Suspense, useEffect, useState } from "react";
import { getTopRatedMovies } from "@/services/movies/getTopRatedMovies";
import MovieList from "@/components/MovieList/MovieList";
import { useRouter, useSearchParams } from "next/navigation";

const TopRatedContent = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    const fetchTopRated = async () => {
      setLoading(true);
      const data = await getTopRatedMovies(page);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    };

    fetchTopRated();
  }, [page]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    router.push(`/top-rated?page=${newPage}`);
  };

  const handleNext = () => {
    if (page < totalPages) updatePage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) updatePage(page - 1);
  };

  return (
    <div>
      <h3 className="text-3xl font-bold mb-6">Top Rated Movies (Page {page})</h3>
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

export default function TopRated() {
  return (
    <Suspense fallback={<p className="text-center">Cargando...</p>}>
      <TopRatedContent />
    </Suspense>
  );
}
