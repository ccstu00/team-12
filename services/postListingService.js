import { Ok, Err } from "../result.js";
import {
  getAll,
  findById,
  create,
  updateById,
  removeById,
} from "../repositories/postListingRepository.js";
import { toEntryDto } from "../dtos/entryDto.js";

// toFixed clears float error first: 19.99 * 100 is 1998.9999999999998
const truncateToCents = (n) =>
  Math.trunc(Number((n * 100).toFixed(6))) / 100;

const validateEntry = ({ listing, amount, description = "" } = {}) => {
  if (!listing) return Err({ status: 400, message: "listing is required" });
  const n = Number(amount);
  if (amount === null || amount === "" || !Number.isFinite(n) || n < 0)
    return Err({ status: 400, message: "amount must be a number, 0 or more" });
  return Ok({ listing, amount: truncateToCents(n), description });
};

export const listEntries = async () => (await getAll()).map(toEntryDto);

export const createEntry = async (data) => {
  const result = validateEntry(data);
  if (!result.ok) return result;
  return Ok(toEntryDto(await create(result.value)));
};

export const updateEntry = async (id, data) => {
  const existing = await findById(id);
  if (!existing) return Err({ status: 404, message: "Entry not found" });

  const result = validateEntry(data);
  if (!result.ok) return result;
  return Ok(toEntryDto(await updateById(id, result.value)));
};

export const deleteEntry = async (id) => {
  const existing = await findById(id);
  if (!existing) return Err({ status: 404, message: "Entry not found" });
  await removeById(id);
  return Ok(null);
};
