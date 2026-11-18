import { Ok, Err } from "../result.js";
import {
  getAll,
  findById,
  create,
  updateById,
  removeById,
} from "../repositories/postListingRepository.js";
// ---------------
import * as usersRepository from "../repositories/usersRepository.js";
import { toEntryDto, toEntryView } from "../dtos/entryDto.js";
// ---------------

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

// ---------------
// Sprint 4 (Unit 18): the resource-aware authorization check. It needs the
// listing already loaded, which is why it lives here and not in a route
// middleware. The cheap ownership comparison runs first; only a non-owner
// costs a database lookup for their role.
const isOwnerOrAdmin = async (entry, actorId) => {
  if (entry.ownerId?.toString() === actorId) return true;
  const account = await usersRepository.findById(actorId);
  return account?.role === "admin";
};

// Whether the actor is an admin. attachUser already put the role on req.user;
// a caller without it (a test, say) gets it looked up.
const isAdmin = async (actor) => {
  if (!actor) return false;
  if (actor.role) return actor.role === "admin";
  return (await usersRepository.findById(actor.id))?.role === "admin";
};

const canChange = (entry, actor, admin) =>
  Boolean(actor) && (admin || entry.ownerId?.toString() === actor.id);

// ---------------
export const listEntries = async () => (await getAll()).map(toEntryDto);

// ---------------
// The page's view of the list: each listing with canChange for this actor
// (false for everyone when logged out). Hiding a button is not authorization:
// updateEntry and deleteEntry below still answer 403 on their own.
export const listEntriesForPage = async (actor) => {
  const admin = await isAdmin(actor);
  return (await getAll()).map((entry) =>
    toEntryView(entry, canChange(entry, actor, admin)),
  );
};

// The owner always comes from the logged-in user, never from the request body.
export const createEntry = async (data, actor) => {
// ---------------
  const result = validateEntry(data);
  if (!result.ok) return result;
  // ---------------
  return Ok(toEntryDto(await create({ ...result.value, ownerId: actor.id })));
  // ---------------
};

// ---------------
export const updateEntry = async (id, data, actor) => {
// ---------------
  const existing = await findById(id);
  if (!existing) return Err({ status: 404, message: "Entry not found" });
  // ---------------
  if (!(await isOwnerOrAdmin(existing, actor.id))) {
    return Err({ status: 403, message: "You do not have permission to modify this listing" });
  }
  // ---------------

  const result = validateEntry(data);
  if (!result.ok) return result;
  return Ok(toEntryDto(await updateById(id, result.value)));
};

// ---------------
export const deleteEntry = async (id, actor) => {
// ---------------
  const existing = await findById(id);
  if (!existing) return Err({ status: 404, message: "Entry not found" });
  // ---------------
  if (!(await isOwnerOrAdmin(existing, actor.id))) {
    return Err({ status: 403, message: "You do not have permission to delete this listing" });
  }
  // ---------------
  await removeById(id);
  return Ok(null);
};
