export const toEntryDto = (entry) => ({
  id: entry._id.toString(),
  listing: entry.listing,
  amount: entry.amount,
  description: entry.description,
});

// ---------------
// For the page only, never for a JSON answer: the entry plus whether the
// person looking at it may change it, so postListing.ejs shows Edit and
// Delete only to them. ownerId itself still never leaves the server.
export const toEntryView = (entry, canChange) => ({ ...toEntryDto(entry), canChange });
// ---------------
