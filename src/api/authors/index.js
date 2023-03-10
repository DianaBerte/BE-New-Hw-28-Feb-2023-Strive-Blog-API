//1. POST --> http://localhost:3001/authors/ => (+ body) create a new author
//2. GET --> http://localhost:3001/authors/ => returns the list of authors
//3. GET (sg user) --> http://localhost:3001/authors/:userId => returns a single author
//4. PUT --> http://localhost:3001/authors/:userId => edit the author with the given id
//5. DELETE --> http://localhost:3001/authors/:userId => delete the author with the given id

//POST /authors/:id/uploadAvatar, uploads a picture (save as idOfTheAuthor.jpg in the public/img/authors folder) for the author specified by the id. Store the newly created URL into the corresponding author in authors.json

import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";
import { sendsRegistrationEmail } from "../../lib/email-tools.js";

const authorsRouter = Express.Router();


const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log(
  "Target:",
  join(dirname(fileURLToPath(import.meta.url)), "users.json")
);

//1
authorsRouter.post("/", (req, res) => {
  //1 read request body
  //   console.log("Request body:", req.body);
  //2 add some info
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  //3 save new author into author.json file
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  //4 send back a proper response
  res.status(201).send({ id: newAuthor.id });

  //   console.log("This is new author:", newAuthor);
  //   res.send({ message: "I am the POST ENDPOINT" });
});

//2
// authorsRouter.get("/", (req, res) => {
//   //1 read content of authors.json
//   const fileContentAsBuffer = fs.readFileSync(authorsJSONPath);

//   //2 convert buffer inot array
//   const authorsArray = JSON.parse(fileContentAsBuffer);

//   //3 send array of authors back as response
//   res.send(authorsArray);
// });

//refactoring GET
authorsRouter.get("/", async (req, res) => {
  const authors = await getAuthors();
  res.send(authors)
})

//3
authorsRouter.get("/:userId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const author = authorsArray.find((author) => author.id === req.params.userId);
  res.send(author);
});

//4
authorsRouter.put("/:userId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex(
    (author) => author.id === req.params.userId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.send(updatedAuthor);
});

//5
authorsRouter.delete("/:userId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.userId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  res.status(204).send();
});

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body
    await sendsRegistrationEmail(email)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default authorsRouter;
