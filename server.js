import express from "express";
import mongoose from "mongoose";
import postListingRouter from "./routes/postListing.js";
import searchRouter from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 3000;

//unit 12: syntax to connect to MongoDB
await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Team-12: UMASS Marketplace");
});
app.use("/listings", postListingRouter);
app.use("/search", searchRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  //sprint 02 fix: malformed JSON gets a 400 error now
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: "Malformed JSON" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
