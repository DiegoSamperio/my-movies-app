import api from "../api";

export const getPopularMovies = async (page: number = 1) => {
  let res: any;
  const endpoint = `/movie/popular?language=en-US&page=${page}`;
  await api.get(endpoint)
    .then((data) => {
      res = data.data;
    })
    .catch((err) => {
      res = err.response;
    });
  return res;
};
