import api from "../api";

export const getMovieById = async (id: string) => {
  let res: any;
  const endpoint = `/movie/${id}`;
  await api.get(endpoint)
    .then((data) => {
      res = data.data;
    })
    .catch((err) => {
      res = err.response;
    });
  return res;
};
