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

DESIGN DECISIONS:

- Ceana Tran: I can account for the postListing features’ layering. Transparently, I followed the Unit 11’s split for this feature’s layout, but there was an aspect of the code I modified to better fit the goals of this website which is in postListingRepository.js, with the entrySchema. In our team’s view, a marketplace listing typically requires two fields: the name of the listing and its price. The description is useful but unnecessary for the item to be posted on the marketplace. This version is better than forcing sellers to write an item description, because if there’s too many requirements in the way of posting the item, people wouldn’t be incentivized to post on our website as opposed to other marketplace sites. We could have also made the entry only require a title, but that means that the buyer has to message the seller about the price, which seems inefficient if a marketplace can’t display the price of the item on the posting itself. The schema rules live inside the postListingRepository because it must interact with the MongoDB database since it interacts with the entire marketplace’s database of listings, and the postListingRepository is the only file that imports MongoDB. A credible alternative to MongoDB is simply using JSON files. With JSON files, we can read and write data directly without having to connect to MongoDB or establishing an internet connection at all . This falls short to our current choice of using MongoDB, because the users must interact with one another on an established connection, and marketplace listings will be revised or posted on many machines, so at scale, reading and writing to JSON files would cause lost data under a website refresh, so if two people were to buy an item at the same time, it would cause unnecessary user complaints on lost money and ownership of the sold item.

-

-

-
