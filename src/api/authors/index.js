//****** authors related endpoints ********/
//****authors CRUD endpoints******/

//1. POST --> http://localhost:3001/authors/ => (+ body) create a new author
//2. GET --> http://localhost:3001/authors/ => returns the list of authors
//3. GET (sg user) --> http://localhost:3001/authors/:userId => returns a single author

import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const authorsRouter = Express.Router();

// console.log("Current file path:", fileURLToPath(import.meta.url));
// console.log("Parent's folder path:", dirname(fileURLToPath(import.meta.url)));
// console.log(
//   "Target:",
//   join(dirname(fileURLToPath(import.meta.url)), "authors.json")
// );

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

//1
authorsRouter.post("/", (req, res) => {
  res.send({ message: "Hello I'm the POST ENDPOINT" });
  // const newAuthor = {...req.body, createdAt: new Date(), updatedAt: new Date(), id: uniqid()}
});

//2
authorsRouter.get("/", (req, res) => {
  //1 read content of authors.json
  const fileContentAsBuffer = fs.readFileSync(authorsJSONPath);

  //2 convert buffer inot array
  const authorsArray = JSON.parse(fileContentAsBuffer);

  //3 send array of authors back as response
  res.send(authorsArray);
});

//3
authorsRouter.get("/:userId", () => {});

export default authorsRouter;
