import api from "../api";

export const getRecommendations = async (id: string) => {
  try {
    const endpoint = `/movie/${id}/recommendations?language=en-US&page=1`;
    const { data } = await api.get(endpoint);
    return data.results;
  } catch (error) {
    console.error("Error fetching recommendations", error);
    return [];
  }
};
