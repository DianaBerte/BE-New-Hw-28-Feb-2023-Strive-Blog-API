//****** authors related endpoints ********/
//****authors CRUD endpoints******/

//1. POST --> http://localhost:3001/authors/ => (+ body) create a new author
//2. GET --> http://localhost:3001/authors/ => returns the list of authors
//3. GET (sg user) --> http://localhost:3001/authors/:userId => returns a single author
//4. PUT --> http://localhost:3001/authors/:userId => edit the author with the given id
//5. DELETE --> http://localhost:3001/authors/:userId => delete the author with the given id

import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

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
console.log(
  "TARGET:",
  join(dirname(fileURLToPath(import.meta.url)), "users.json")
);

//1
authorsRouter.post("/", (req, res) => {
  //1 read request body
  console.log("Request body:", req.body);
  //2 add some info
  //3 save new author into author.json file
  //4 send back a proper response
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  console.log("This is new author:", newAuthor);
  res.send({ message: "I am the POST ENDPOINT" });
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
authorsRouter.get("/:userId", (req, res) => {});

//4
authorsRouter.put("/:userId", (req, res) => {});

//5
authorsRouter.delete("/:userId", (req, res) => {});

export default authorsRouter;
