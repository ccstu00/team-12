import { Ok, Err } from "../result.js";
import { getAll } from "../repositories/searchRepository.js";
import { toEntryDto } from "../dtos/entryDto.js";

const validateQuery = (q = "") => {
  if (typeof q !== "string")
    return Err({ status: 400, message: "search must be text" });
  return Ok(q.trim().toLowerCase());
};

export const searchListings = async (q) => {
  const result = validateQuery(q);
  if (!result.ok) return result;

  const search = result.value;
  const entries = await getAll();
  const matches = entries.filter(
    (entry) =>
      entry.listing.toLowerCase().includes(search) ||
      entry.description.toLowerCase().includes(search),
  );
  return Ok(matches.map(toEntryDto));
};