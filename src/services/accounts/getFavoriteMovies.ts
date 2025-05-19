// src/services/accounts/getFavoriteMovies.ts
import api from "../api";

export const getFavoriteMovies = async (guestSessionId: string, page: number = 1) => {
  let res: any;
  const endpoint = `/account/guest_session/${guestSessionId}/favorite/movies?language=en-US&page=${page}`;
  await api.get(endpoint)
    .then((data) => {
      res = data.data;
    })
    .catch((err) => {
      res = err.response;
    });
  return res;
};
