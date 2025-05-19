import api from "../api";

export const getMovieVideos = async (movieId: string) => {
  let res: any;
  const endpoint = `/movie/${movieId}/videos?language=en-US`;
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