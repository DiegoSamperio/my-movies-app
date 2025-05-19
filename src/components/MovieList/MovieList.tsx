// src/components/MovieList.tsx
import MovieCard from "../MovieCard/MovieCard";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  overview: string;
}

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={{
            pathname: `/movie/${movie.id}`,
          }}
        >
          <MovieCard
            title={movie.title}
            voteAverage={movie.vote_average}
            posterPath={movie.poster_path}
            releaseYear={parseInt(movie.release_date?.split("-")[0])}
            description={movie.overview}
          />
        </Link>
      ))}
    </div>
  );
};

export default MovieList;
