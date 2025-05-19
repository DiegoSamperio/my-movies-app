import api from "../api";

export const searchMovies = async (query: string, page: number = 1) => {
  let res: any;
  const endpoint = `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
  await api
    .get(endpoint)
    .then((data) => {
      res = data.data;
    })
    .catch((err) => {
      res = err.response;
    });
  return res;
};