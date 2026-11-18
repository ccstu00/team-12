import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/postListingRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn((id, data) => ({ _id: id, ...data })),
  removeById: jest.fn(),
}));

// ---------------
jest.unstable_mockModule("../repositories/usersRepository.js", () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

// ---------------
const { create, findById, getAll, removeById, updateById } =
  await import("../repositories/postListingRepository.js");
// ---------------
const usersRepository = await import("../repositories/usersRepository.js");
const {
  createEntry,
  updateEntry,
  deleteEntry,
  listEntries,
  listEntriesForPage,
} =
  // ---------------
  await import("../services/postListingService.js");

// ---------------
const alice = { id: "alice-id" };
const bob = { id: "bob-id" };
const admin = { id: "admin-id" };

// Mongoose gives back an ObjectId, so the mock only needs a toString.
// ---------------
const existingEntry = {
  _id: "fake-id",
  listing: "textbook",
  amount: 40,
  description: "from MATH132",
  // ---------------
  ownerId: { toString: () => "alice-id" },
  // ---------------
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createEntry", () => {
  test("rejects a missing listing", async () => {
    // ---------------
    const result = await createEntry({ listing: "", amount: 10 }, alice);
    // ---------------
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(result.error.message).toBe("listing is required");
    expect(create).not.toHaveBeenCalled();
  });

  test("rejects a request with no data at all", async () => {
    // ---------------
    const result = await createEntry(undefined, alice);
    // ---------------
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
    const result = await createEntry({ listing: "textbook", amount }, alice);
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(result.error.message).toBe("amount must be a number, 0 or more");
    expect(create).not.toHaveBeenCalled();
  });

  test("saves a valid entry and returns its DTO", async () => {
    const result = await createEntry(
      {
        listing: "textbook",
        amount: 40,
        description: "from MATH132",
      },
      alice,
    );
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      id: "fake-id",
      listing: "textbook",
      amount: 40,
      description: "from MATH132",
    });
  });

  test("accepts an amount of 0", async () => {
    const result = await createEntry(
      { listing: "free binder", amount: 0 },
      alice,
    );

    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(0);
  });

  test("converts a numeric string amount to a number", async () => {
    const result = await createEntry(
      { listing: "textbook", amount: "12.50" },
      alice,
    );
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(12.5);
  });

  //note: at some point we should make it so that you can't type decimals places greater than two.
  test("the price shouldn't have more than 2 decimal places.", async () => {
    const result = await createEntry(
      { listing: "textbook", amount: 12.345 },
      alice,
    );
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(12.34);
  });

  test("should keep an amount that already has two decimals", async () => {
    const result = await createEntry(
      { listing: "textbook", amount: 19.99 },
      alice,
    );
    expect(result.ok).toBe(true);
    expect(result.value.amount).toBe(19.99);
  });
});

describe("updateEntry", () => {
  test("returns a 404 Err when the entry does not exist", async () => {
    findById.mockResolvedValue(null);
    const result = await updateEntry(
      "missing-id",
      { listing: "textbook", amount: 40 },
      alice,
    );
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(404);
    expect(result.error.message).toBe("Entry not found");
    expect(updateById).not.toHaveBeenCalled();
  });

  test("rejects a missing listing", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry(
      "fake-id",
      { listing: "", amount: 40 },
      alice,
    );
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(updateById).not.toHaveBeenCalled();
  });

  test("rejects an invalid price", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry(
      "fake-id",
      { listing: "textbook", amount: -1 },
      alice,
    );
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(400);
    expect(updateById).not.toHaveBeenCalled();
  });

  test("saves a valid update and returns its DTO", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry(
      "fake-id",
      { listing: "Standing textbook", amount: 55, description: "from MATH132" },
      alice,
    );
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
    const result = await deleteEntry("missing-id", alice);
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(404);
    expect(result.error.message).toBe("Entry not found");
    expect(removeById).not.toHaveBeenCalled();
  });

  test("removes an entry that exists", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await deleteEntry("fake-id", alice);
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

describe("authorization", () => {
  test("createEntry stamps the actor as ownerId, ignoring an ownerId in the body", async () => {
    await createEntry(
      { listing: "textbook", amount: 40, ownerId: "bob-id" },
      alice,
    );
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: "alice-id" }),
    );
  });

  test("createEntry never exposes ownerId in its DTO", async () => {
    const result = await createEntry(
      { listing: "textbook", amount: 40 },
      alice,
    );
    expect(result.value.ownerId).toBeUndefined();
  });

  test("updateEntry returns a 403 Err when a non-owner, non-admin tries to modify it", async () => {
    findById.mockResolvedValue(existingEntry);
    usersRepository.findById.mockResolvedValue({ role: "member" });
    const result = await updateEntry(
      "fake-id",
      { listing: "mine now", amount: 1 },
      bob,
    );
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(403);
    expect(updateById).not.toHaveBeenCalled();
  });

  test("updateEntry lets the owner modify it without looking up their role", async () => {
    findById.mockResolvedValue(existingEntry);
    const result = await updateEntry(
      "fake-id",
      { listing: "textbook", amount: 35 },
      alice,
    );
    expect(result.ok).toBe(true);
    expect(usersRepository.findById).not.toHaveBeenCalled();
  });

  test("updateEntry lets an admin modify a listing they do not own", async () => {
    findById.mockResolvedValue(existingEntry);
    usersRepository.findById.mockResolvedValue({ role: "admin" });
    const result = await updateEntry(
      "fake-id",
      { listing: "textbook", amount: 35 },
      admin,
    );
    expect(result.ok).toBe(true);
    expect(updateById).toHaveBeenCalled();
  });

  test("deleteEntry returns a 403 Err when a nonowner or nonadmin attempts deletion", async () => {
    findById.mockResolvedValue(existingEntry);
    usersRepository.findById.mockResolvedValue({ role: "member" });
    const result = await deleteEntry("fake-id", bob);
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(403);
    expect(removeById).not.toHaveBeenCalled();
  });

  test("deleteEntry lets an admin delete a listing they do not own", async () => {
    findById.mockResolvedValue(existingEntry);
    usersRepository.findById.mockResolvedValue({ role: "admin" });
    const result = await deleteEntry("fake-id", admin);
    expect(result.ok).toBe(true);
    expect(removeById).toHaveBeenCalledWith("fake-id");
  });

  test("a listing with no owner can only be changed by an admin", async () => {
    findById.mockResolvedValue({ ...existingEntry, ownerId: undefined });
    usersRepository.findById.mockResolvedValue({ role: "member" });
    const result = await deleteEntry("fake-id", alice);
    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(403);
  });

  test("listEntriesForPage lets an admin change every listing", async () => {
    getAll.mockResolvedValue([existingEntry]);
    const result = await listEntriesForPage({ id: "admin-id", role: "admin" });
    expect(result[0].canChange).toBe(true);
  });

  test("listEntriesForPage logged out: nothing is changeable", async () => {
    getAll.mockResolvedValue([existingEntry]);
    const result = await listEntriesForPage(undefined);
    expect(result[0].canChange).toBe(false);
  });
});
