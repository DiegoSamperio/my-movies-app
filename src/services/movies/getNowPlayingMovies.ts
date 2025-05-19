import api from "../api";

export const getNowPlayingMovies = async (page: number = 1) => {
  let res: any;
  const endpoint = `/movie/now_playing?language=en-US&page=${page}`;
  await api.get(endpoint)
    .then((data) => {
      res = data.data;
    })
    .catch((err) => {
      res = err.response;
    });
  return res;
};
