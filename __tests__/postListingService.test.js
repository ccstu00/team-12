import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/postListingRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn((id, data) => ({ _id: id, ...data })),
  removeById: jest.fn(),
}));

const { create, findById, getAll, removeById, updateById } =
  await import("../repositories/postListingRepository.js");
const { createEntry, updateEntry, deleteEntry, listEntries } =
  await import("../services/postListingService.js");

const existingEntry = {
  _id: "fake-id",
  listing: "textbook",
  amount: 40,
  description: "from MATH132",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createEntry", () => {
  test("rejects a missing listing", async () => {
    const result = await createEntry({ listing: "", amount: 10 });
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(result.error.message).toBe("listing is required");
    expect(create).not.toHaveBeenCalled();
  });

  test("rejects a request with no data at all", async () => {
    const result = await createEntry(undefined);
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  test.each([
    ["missing", undefined],
    ["null", null],
    ["an empty string", ""],
    ["NAN", "abc"],
    ["infinite", Infinity],
    ["negative", -1],
  ])("rejects an amount that is %s", async (label, amount) => {
    const result = await createEntry({ listing: "textbook", amount });
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(result.error.message).toBe("amount must be a number, 0 or more");
    expect(create).not.toHaveBeenCalled();
  });

  test("saves a valid entry and returns its DTO", async () => {
    const result = await createEntry({
      listing: "textbook",
      amount: 40,
      description: "from MATH132",
    });
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      id: "fake-id",
      listing: "textbook",
      amount: 40,
      description: "for MATH132",
    });
  });

  test("accepts an amount of 0", async () => {
    const result = await createEntry({ listing: "free binder", amount: 0 });
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(0);
  });

  test("converts a numeric string amount to a number", async () => {
    const result = await createEntry({ listing: "textbook", amount: "12.50" });
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(12.5);
  });

  test("should drop decimals after two places, not round", async () => {
    const result = await createEntry({ listing: "textbook", amount: 12.345 });
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(12.34);
  });

  test("should keep an amount that already has two decimals", async () => {
    const result = await createEntry({ listing: "textbook", amount: 19.99 });
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(19.99);
  });

  test("defaults a missing description to an empty string", async () => {
    const result = await createEntry({ listing: "textbook", amount: 40 });
    expect(result.ok).toBe(true);
    expect(result.value.description).toBe("");
  });
});

describe("updateEntry", () => {
  test("returns a 404 Err when the entry does not exist", async () => {
    findById.mockResolvedValue(null);
    const result = await updateEntry("missing-id", {
      listing: "textbook",
      amount: 40,
    });
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(404);
    expect(result.error.message).toBe("Entry not found");
    expect(updateById).not.toHaveBeenCalled();
  });

  test("rejects a missing listing", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry("fake-id", { listing: "", amount: 40 });
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(updateById).not.toHaveBeenCalled();
  });

  test("rejects an invalid price", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry("fake-id", {
      listing: "textbook",
      amount: -1,
    });
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(updateById).not.toHaveBeenCalled();
  });

  test("saves a valid update and returns its DTO", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry("fake-id", {
      listing: "Standing textbook",
      amount: 55,
      description: "from MATH132",
    });
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      id: "fake-id",
      listing: "Standing textbook",
      amount: 55,
      description: "from MATH132",
    });
  });
});

describe("deleteEntry", () => {
  test("returns 404 when the entry doesn't exist", async () => {
    findById.mockResolvedValue(null);
    const result = await deleteEntry("missing-id");
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(404);
    expect(result.error.message).toBe("Entry not found");
    expect(removeById).not.toHaveBeenCalled();
  });

  test("removes an entry that exists", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await deleteEntry("fake-id");
    expect(result.ok).toBe(true);
    expect(result.value).toBe(null);
    expect(removeById).toHaveBeenCalledWith("fake-id");
  });
});

describe("listEntries", () => {
  test("returns every entry as a DTO", async () => {
    getAll.mockResolvedValue([existingEntry]);
    const result = await listEntries();
    expect(result).toEqual([
      {
        id: "fake-id",
        listing: "textbook",
        amount: 40,
        description: "from MATH132",
      },
    ]);
  });
});
