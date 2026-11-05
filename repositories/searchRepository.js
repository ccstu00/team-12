import { Entry } from "./postListingRepository.js";

export const getAll = async () => Entry.find().lean();