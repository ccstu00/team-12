import * as searchService from "../services/searchService.js";

export const index = async (req, res) => {
  const result = await searchService.searchListings(req.query.q);
  if (!result.ok) {
    res.status(result.error.status).send(result.error.message);
    return;
  }
  res.set("X-Total-Count", result.value.length);
  res.status(200).render("search", {
    title: "Search",
    query: req.query.q ?? "",
    entries: result.value,
  });
};