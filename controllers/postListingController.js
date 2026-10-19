import * as postListingService from "../services/postListingService.js";
import { isValidId } from "../repositories/postListingRepository.js";

export const index = async (req, res) => {
  const entries = await postListingService.listEntries();
  res.set("X-Total-Count", entries.length);
  res.status(200).render("postListing", { title: "Listings", entries });
};

export const create = async (req, res) => {
  const result = await postListingService.createEntry(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(201).json(result.value);
};

export const createClassic = async (req, res) => {
  const result = await postListingService.createEntry(req.body);
  if (!result.ok) {
    res.status(result.error.status).send(result.error.message);
    return;
  }
  res.redirect("/listings");
};

export const update = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a valid id" });
    return;
  }
  const result = await postListingService.updateEntry(id, req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(200).json(result.value);
};

export const destroy = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a valid id" });
    return;
  }
  const result = await postListingService.deleteEntry(id);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(204).send();
};
