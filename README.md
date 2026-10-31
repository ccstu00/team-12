Jacob Allen: jalleno5
Simon Tougas: sftougas
Ann Marie Nguyen: annmarienguyen
Ceana Tran: ccstu00

- There will be mandatory meetings Monday 6PM. Additional meetings can be arranged if issues arise.
- "done" means that a PR has been reviewed by at least one teammate, preferably all.
- Meetings will scheduled for major disagreements, whilst minor disagreements will be resolved via Discord

WHAT IS THIS PROJECT?:

This project is a website specifically for UMass students to post and find items and services. Students can use the website to buy and sell, advertise different services, and find a sense of community. The goal is to give students a place to advertise and find things on campus without relying solely on social media.

HOW TO RUN LOCALLY:

PREREQUISITES:

- Node.js 18 or newer (You can check this with `node -v`)
- Git

In your terminal:

1. git clone https://github.com/ccstu00/team-12.git
2. cd team-12
3. npm install && npm start

The server should be on http://localhost:3000 in your browser.

## HOW TO USE:

### Posting a listing:

1. Go to http://localhost:3000/listings
2. Fill in the form:
   - Listing (required): the name of what you're selling, like "Desk lamp"
   - Amount (required): the price, 0 or more. Extra decimals past 2 get dropped
   - Description (optional): any details
3. Click "Add listing"

The page reloads and your listing shows up in the list below the form. If you leave out the name or put in a bad price, the server sends back an error message instead of saving it.

Each listing has an Edit button (change the name, price or description, then click Save) and a Delete button (asks you to confirm first).

### Searching listings:

1. Go to http://localhost:3000/search
2. Type a word into the search bar, like "lamp"
3. Click "Search"

You'll see what you searched and how many results came back, then every listing whose name or description contains that word. It isn't case sensitive and matches partial words, so "lam" finds "Desk lamp". If nothing matches, it says "Sorry, no listings found." Opening /search before searching anything just shows all listings.

## SPRINT 3 CHANGES:

### Tests

Added Jest tests for the service layer. The repository is mocked with `jest.unstable_mockModule`, so the tests don't need the database running.

To run them (`npm install` is only needed the first time, to install Jest):

```
npm install
npm test
```

This runs every test file in the `__tests__` folder:

- `__tests__/searchService.test.js`: checks that search rejects input that isn't text (400), returns every listing for a blank search, matches listing names regardless of case, and matches descriptions

DESIGN DECISIONS:

- Ceana Tran: I can account for the postListing features’ layering. Transparently, I followed the Unit 11’s split for this feature’s layout, but there was an aspect of the code I modified to better fit the goals of this website which is in postListingRepository.js, with the entrySchema. In our team’s view, a marketplace listing typically requires two fields: the name of the listing and its price. The description is useful but unnecessary for the item to be posted on the marketplace. This version is better than forcing sellers to write an item description, because if there’s too many requirements in the way of posting the item, people wouldn’t be incentivized to post on our website as opposed to other marketplace sites. We could have also made the entry only require a title, but that means that the buyer has to message the seller about the price, which seems inefficient if a marketplace can’t display the price of the item on the posting itself. The schema rules live inside the postListingRepository because it must interact with the MongoDB database since it interacts with the entire marketplace’s database of listings, and the postListingRepository is the only file that imports MongoDB. A credible alternative to MongoDB is simply using JSON files. With JSON files, we can read and write data directly without having to connect to MongoDB or establishing an internet connection at all . This falls short to our current choice of using MongoDB, because the users must interact with one another on an established connection, and marketplace listings will be revised or posted on many machines, so at scale, reading and writing to JSON files would cause lost data under a website refresh, so if two people were to buy an item at the same time, it would cause unnecessary user complaints on lost money and ownership of the sold item.

- Jacob Allen: Blank search shows everything. If someone searches with nothing typed in, the service returns every listing instead of an error. The other option was treating a blank search like bad input and sending back a 400 saying a search term is required. I went with showing everything because going to the search page with nothing typed should just be a 'browsing' mode, not an error. The 400 version would make users type something just to see what’s for sale, and the frontend would need extra handling for that error, so ultimately having a blank search show everything was the way to go for our application.

Jacob Allen (Sprint 3): Search tests use a mocked repository instead of a real database. The other option was testing against a real MongoDB with test listings inserted. I went with the mock because the tests only need to check the search rules, and they run instantly with no database. The real database version would make everyone run Mongo just to run npm test and would leave test listings behind in the database.

Simon: We chose to put validation of entry field rules for posting listings into only the service layer. The alternative to this would be to split the validation between the service and controller layers for the post feature. Entry validation in the controller layer could benefit the service layer by rejecting bad input before it reaches the service layer. We kept the rules in the service layer because it will help us moving forward when it comes to testing the feature. A service function only needs to pass an object for the programmer to test the results, whereas the controller needs to build test req and res objects in order to test validation. Keeping validation of entry fields avoids the need for building convoluted tests. Also, create and createClassic both call createEntry, if the rules were in the controller, each rule would have to be written twice. If a programmer forgot to write them twice, create and createClassic would quietly enforce different sets of rules.
Simon Tougas

- Ann Marie Nguyen: Our team used includes() to match search results. While testing the search bar, I created listings for “hat” and “chair.” Then I searched for “ha” in particular, which returned both listings since both words contain those letters in that order. It made me reconsider whether the search should match the text anywhere or only at the beginning, which is the difference between using includes() and startsWith(). While both includes() and startsWith() have their own tradeoffs, includes() is more flexible, whereas startsWith() is stricter. For example, an alternative like startsWith() would return “hat” for the search “ha,” but a search for “hat” would miss a listing like “green hat” because the listing starts with “green.” The tradeoff with using includes() would be returning unrelated listings like “chair” and as the number of posts increases, this can become an issue in terms of scaling. Even though includes() means some listings might not match what a user is looking for, it’s better to see everything and skip those listings manually than to use startsWith(), which would completely hide relevant listings just because they don’t match the start exactly.

## System Diagram

```
            Browser (postListing.ejs, search.ejs)
                 |                    |
          /listings              /search?q=
                 |                    |
                 v                    v
            server.js (mounts both routers, error handler)
                 |                    |
  Routes     postListing.js        search.js
                 |                    |
  Controller postListingController searchController
                 |                    |
  Service    postListingService    searchService
             (validates listing)   (validates search, filters)
                 |                    |
  Repository postListingRepository <- searchRepository
                 |                 (uses the same Entry model)
                 v
              MongoDB

  The response goes back up the same path and the
  controller renders the page (or sends a 400 if
  validation fails).
```

-

-
