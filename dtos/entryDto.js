export const toEntryDto = (entry) => ({
  id: entry._id.toString(),
  listing: entry.listing,
  amount: entry.amount,
  description: entry.description,
});
