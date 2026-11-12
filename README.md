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
3. npm install
4. npm run build:css
5. npm start

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

Each listing has an Edit button (change the name, price or description, then click Save) and a Delete button (asks you to confirm first, then removes the listing without reloading the page, using HTMX).

### Searching listings:

1. Go to http://localhost:3000/search
2. Type a word into the search bar, like "lamp"
3. Click "Search"

You'll see what you searched and how many results came back, then every listing whose name or description contains that word. It isn't case sensitive and matches partial words, so "lam" finds "Desk lamp". If nothing matches, it says "Sorry, no listings found." Opening /search before searching anything just shows all listings.

## SPRINT 3 CHANGES:

### MongoDB

Listings are stored in MongoDB through Mongoose. The schema is in `repositories/postListingRepository.js` (`listing` and `amount` required, `description` optional), and the repository uses per-record operations: `getAll`, `findById`, `create`, `updateById` and `removeById`. Search reuses the same `Entry` model in `repositories/searchRepository.js`. No other layer had to change, and there was no array-index id to fix, since the views already used the MongoDB `_id` from Sprint 2.

To run it, open the project in the dev container and start Mongo before starting the server:

```
dc-up mongo
npm install
npm run build:css
npm start
```

The server connects to `mongodb://dev:devpassword@mongo:27017/devdb` by default, or to `MONGODB_URI` if it's set.

Routes that hit MongoDB:

- `GET /listings`: loads every listing
- `POST /listings/classic`: saves a new listing from the form
- `PUT /listings/:id` and `DELETE /listings/:id`: edit or delete one listing by its MongoDB id
- `GET /search?q=`: loads listings to search through

To check it's really in the database: add a listing, stop the server with Ctrl+C, run `npm start` again, and the listing is still there.

### Tests

for postListing: Added `__tests__/postListingService.test.js`, in `services/postListingService.js`. The repository is mocked with `jest.unstable_mockModule`, so the tests doesn't need a running server or MongoDB connection and leave no data behind.

Run `__tests__/postListingService.test.js` to for postListing tests

To run only this file, run
`npm install`
`npm test -- postListingService`

To run every test file in `__tests__`, including the search tests, use `npm test`.

for search implementation: Added Jest tests for the service layer. The repository is mocked with `jest.unstable_mockModule`, so the tests don't need the database running.

To run them (`npm install` is only needed the first time, to install Jest):

```
npm install
npm test
```

This runs every test file in the `__tests__` folder:

- `__tests__/searchService.test.js`: checks that search rejects input that isn't text (400), returns every listing for a blank search, matches listing names regardless of case, and matches descriptions

- `__tests__/postListingService.test.js`: checks that posting rejects a missing listing name or a bad amount (400), that editing or deleting a listing that doesn't exist returns a 404, and that valid listings save correctly

### Tailwind Visual Design

The input file is src/input.css. In order to build the css, you must run the command: `npm run build:css`, or `npm run watch:css` for ongoing changes. All the different design choices were made using utility class within the views ejs files. The website can now be viewed in different screen sizes including desktop and mobile devices. For devices like phones the title of the pages stack above the nav links. The site switches to one row at the sm breakpoint 640 px. This can be found in views/partials/header.ejs. This is possible because of the viewport tag in both search.ejs and postListing.ejs.

Some of the stylistic changes include:

- Overall Layout
  - All displayed listings and content are centered. This is the case for both the listings and search features.
- Button Style Changes
  - Search, add listing, and save are blue with a hover color.
  - Edit and cancel are outlined in gray
  - Delete is outlined in red
- Header Style Changes
  - Bolded font
  - Changed Spacing
- Listings
  - colored white
  - black borders
  - Spacing between them

### HTMX

The Delete button on `/listings` uses HTMX instead of a hand-written fetch and a full page reload. The button in `views/postListing.ejs` has `hx-delete`, `hx-target` and `hx-swap`, so after you confirm, it sends `DELETE /listings/:id` and only that listing gets removed from the page.

To check it: add a listing on `/listings`, click Delete and confirm. The listing disappears without the page reloading, and the Network tab shows one `DELETE` request.

DESIGN DECISIONS:

- Ceana Tran(Sprint 2): I can account for the postListing features’ layering. Transparently, I followed the Unit 11’s split for this feature’s layout, but there was an aspect of the code I modified to better fit the goals of this website which is in postListingRepository.js, with the entrySchema. In our team’s view, a marketplace listing typically requires two fields: the name of the listing and its price. The description is useful but unnecessary for the item to be posted on the marketplace. This version is better than forcing sellers to write an item description, because if there’s too many requirements in the way of posting the item, people wouldn’t be incentivized to post on our website as opposed to other marketplace sites. We could have also made the entry only require a title, but that means that the buyer has to message the seller about the price, which seems inefficient if a marketplace can’t display the price of the item on the posting itself. The schema rules live inside the postListingRepository because it must interact with the MongoDB database since it interacts with the entire marketplace’s database of listings, and the postListingRepository is the only file that imports MongoDB. A credible alternative to MongoDB is simply using JSON files. With JSON files, we can read and write data directly without having to connect to MongoDB or establishing an internet connection at all . This falls short to our current choice of using MongoDB, because the users must interact with one another on an established connection, and marketplace listings will be revised or posted on many machines, so at scale, reading and writing to JSON files would cause lost data under a website refresh, so if two people were to buy an item at the same time, it would cause unnecessary user complaints on lost money and ownership of the sold item.

Ceana Tran(Sprint 3): I used mockRepository because we'd have to run a real database live, and there's also the additional step of removing the test listings after the test cases have been run in the database, which can be tedious. The mockRepository is a throwaway repository and doesn't leave anything behind to remove later, which makes it faster to test. For the truncating cents update, this is more optimal because the alternative, which was rounding the decimal place if the decimal place was 5 or greater, doesn't make sense because it should cap at 2 decimals which make the other numbers invalid. Next sprint, I'll make it so that the user can only type up to 2 decimals instead of dropping decimals, because it's strange to be able to type more than 2 decimals for cash. If a seller saw the rounding policy, it would be strange because it would be different from other marketplaces that cannot have greater than 2 decimal places, and for the user, they would be confused if they show the price for more than what they typed in, say 3.456 to 3.46 instead.

- Jacob Allen: Blank search shows everything. If someone searches with nothing typed in, the service returns every listing instead of an error. The other option was treating a blank search like bad input and sending back a 400 saying a search term is required. I went with showing everything because going to the search page with nothing typed should just be a 'browsing' mode, not an error. The 400 version would make users type something just to see what’s for sale, and the frontend would need extra handling for that error, so ultimately having a blank search show everything was the way to go for our application.

Jacob Allen (Sprint 3): Search tests use a mocked repository instead of a real database. The other option was testing against a real MongoDB with test listings inserted. I went with the mock because the tests only need to check the search rules, and they run instantly with no database. The real database version would make everyone run Mongo just to run npm test and would leave test listings behind in the database.

-Simon Tougas(Sprint 2): We chose to put validation of entry field rules for posting listings into only the service layer. The alternative to this would be to split the validation between the service and controller layers for the post feature. Entry validation in the controller layer could benefit the service layer by rejecting bad input before it reaches the service layer. We kept the rules in the service layer because it will help us moving forward when it comes to testing the feature. A service function only needs to pass an object for the programmer to test the results, whereas the controller needs to build test req and res objects in order to test validation. Keeping validation of entry fields avoids the need for building convoluted tests. Also, create and createClassic both call createEntry, if the rules were in the controller, each rule would have to be written twice. If a programmer forgot to write them twice, create and createClassic would quietly enforce different sets of rules.

Simon Tougas (Sprint 3): A design decision the team made for the Tailwind restyle was gitignoring output.css. The alternative to this would be to commit public/output.css to main which would allow a fresh clone to run. The version the team chose is better than the alternative because during the process of completing this sprint multiple people will be working with style classes. If a person forgets to update output.css problems such as an unstyled page will arise when an out of date output.css is merged into main. Problems would also come up when it came time for merging branches, any two branches that change styling would risk a merge conflict in output.css, a file that is not designed to be read. The conflict would not be fixed by deleting a couple lines, a group member would have to delete it and run the build command again. Overall, the direction the team decided is better to avoid potential problems with the main drawback being running an extra command.

- Ann Marie Nguyen: Our team used includes() to match search results. While testing the search bar, I created listings for “hat” and “chair.” Then I searched for “ha” in particular, which returned both listings since both words contain those letters in that order. It made me reconsider whether the search should match the text anywhere or only at the beginning, which is the difference between using includes() and startsWith(). While both includes() and startsWith() have their own tradeoffs, includes() is more flexible, whereas startsWith() is stricter. For example, an alternative like startsWith() would return “hat” for the search “ha,” but a search for “hat” would miss a listing like “green hat” because the listing starts with “green.” The tradeoff with using includes() would be returning unrelated listings like “chair” and as the number of posts increases, this can become an issue in terms of scaling. Even though includes() means some listings might not match what a user is looking for, it’s better to see everything and skip those listings manually than to use startsWith(), which would completely hide relevant listings just because they don’t match the start exactly.

Ann Marie Nguyen (Sprint 3): Decided to add the delete operation using HTMX because it removes listings without refreshing the whole page and reduces the amount of manual javascript. For an app like our marketplace where users can create multiple listings, it's not necessary to reload the entire page when only one post needs to be removed, making this version better than the original version, which reloads the entire page every time a listing is deleted. Using HTMX allows for specific parts of the page to be updated without affecting anything else. HTMX also replaces several lines of code with short and simple attributes, such as hx-confirm for the confirmation dialogue, hx-delete for the delete request, and hx-target and hx-swap for removing the listing. The cost of the alternative (writing client side javascript) is that it required over 20 lines of code in public/app.js to listen for clicks, find the button clicked and ID for the listing, confirm the deletion, use fetch() to send the request, handle errors, and reload the page.

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
  Service    postListingService    searchService      <-- Jest tests (__tests__/)
             (validates listing)   (validates             postListingService.test.js
                 |                  search, filters)      searchService.test.js
                 |                    |                   repo mocked with jest,
                 |                    |                   no database
  Repository postListingRepository <- searchRepository
                 |                 (uses the same Entry model)
                 v
              MongoDB

  The response goes back up the same path and the
  controller renders the page (or sends a 400 if
  validation fails).


    Helpers: asyncHandler.js (wraps routes), result.js + dtos/entryDto.js
  (used by services), views/partials/header.ejs, public/app.js (browser)
```
