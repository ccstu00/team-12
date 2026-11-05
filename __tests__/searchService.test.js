import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/searchRepository.js", () => ({
  getAll: jest.fn(),
}));

const { searchListings } = await import("../services/searchService.js");
const { getAll } = await import("../repositories/searchRepository.js");

const listings = [
  { _id: "1", listing: "Sand Wedge", amount: 15, description: "barely used" },
  { _id: "2", listing: "Calc Tutoring", amount: 25, description: "Math 131" },
];

test("searchListings rejects a search that is not text", async () => {
  const result = await searchListings(["I am", "an object"]);
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
});

test("searchListings returns every listing for a blank search", async () => {
  getAll.mockResolvedValueOnce(listings);
  const result = await searchListings("");
  expect(result.ok).toBe(true);
  expect(result.value.map((entry) => entry.listing)).toEqual([
    "Sand Wedge",
    "Calc Tutoring",
  ]);
});

test("searchListings matches the listing name, ignoring case", async () => {
  getAll.mockResolvedValueOnce(listings);
  const result = await searchListings("WEDGE");
  expect(result.ok).toBe(true);
  expect(result.value.map((entry) => entry.listing)).toEqual(["Sand Wedge"]);
});

test("searchListings matches the description", async () => {
  getAll.mockResolvedValueOnce(listings);
  const result = await searchListings("math");
  expect(result.ok).toBe(true);
  expect(result.value.map((entry) => entry.listing)).toEqual(["Calc Tutoring"]);
});
