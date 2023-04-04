//POST /authors/:id/uploadAvatar, uploads a picture (save as idOfTheAuthor.jpg in the public/img/authors folder) for the author specified by the id. Store the newly created URL into the corresponding author in authors.json

import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";
import { sendsRegistrationEmail } from "../../lib/email-tools.js";
import AuthorsModel from "./model.js";
import createHttpError from "http-errors";
import { basicAuthenticationMiddleware } from "../../lib/auth/basic.js";
import { adminOnlyMiddleware } from "../../lib/auth/admin.js";

const authorsRouter = Express.Router();


const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log(
  "Target:",
  join(dirname(fileURLToPath(import.meta.url)), "users.json")
);

// //1
// authorsRouter.post("/", (req, res) => {
//   //1 read request body
//   //   console.log("Request body:", req.body);
//   //2 add some info
//   const newAuthor = {
//     ...req.body,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     id: uniqid(),
//   };
//   //3 save new author into author.json file
//   const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
//   authorsArray.push(newAuthor);
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
//   //4 send back a proper response
//   res.status(201).send({ id: newAuthor.id });

//   //   console.log("This is new author:", newAuthor);
//   //   res.send({ message: "I am the POST ENDPOINT" });
// });

//1. POST THE MONGO WAY:
authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

//2
// authorsRouter.get("/", (req, res) => {
//   //1 read content of authors.json
//   const fileContentAsBuffer = fs.readFileSync(authorsJSONPath);

//   //2 convert buffer inot array
//   const authorsArray = JSON.parse(fileContentAsBuffer);

//   //3 send array of authors back as response
//   res.send(authorsArray);
// });

//2. GET the MONGO way
authorsRouter.get("/", basicAuthenticationMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find({})
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/me", basicAuthenticationMiddleware, async (req, res, next) => {
  try {
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/me", basicAuthenticationMiddleware, async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(req.author._id, req.body, { new: true, runValidators: true })
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

//3. GET with id the old way
// authorsRouter.get("/:userId", (req, res) => {
//   const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
//   const author = authorsArray.find((author) => author.id === req.params.userId);
//   res.send(author);
// });

//3. GET WITH ID the MONGO way
authorsRouter.get("/:authorId", basicAuthenticationMiddleware, async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorId)
    if (author) {
      res.send(author)
    } else {
      next(createHttpError(404, `Author with id ${req.params.authorId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

//4. PUT the old way
// authorsRouter.put("/:userId", (req, res) => {
//   const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
//   const index = authorsArray.findIndex(
//     (author) => author.id === req.params.userId
//   );
//   const oldAuthor = authorsArray[index];
//   const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
//   authorsArray[index] = updatedAuthor;

//   fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
//   res.send(updatedAuthor);
// });

//4. PUT the MONGO way
authorsRouter.put("/:authorId", basicAuthenticationMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true, runValidators: true }
    )
    if (updatedAuthor) {
      res.send(updatedAuthor)
    } else {
      next(createHttpError(404, `Author with id ${req.params.authorId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

//5 delete the old way
// authorsRouter.delete("/:userId", (req, res) => {
//   const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
//   const remainingAuthors = authorsArray.filter(
//     (author) => author.id !== req.params.userId
//   );
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
//   res.status(204).send();
// });

// authorsRouter.post("/register", async (req, res, next) => {
//   try {
//     const { email } = req.body
//     await sendsRegistrationEmail(email)
//     res.send()
//   } catch (error) {
//     next(error)
//   }
// })y

//5. DELETE the MONGO way
authorsRouter.delete("/:authorId", basicAuthenticationMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorsModel.findByIdAndDelete(req.params.authorId)
    if (deletedAuthor) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Author with id ${req.params.authorId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter;
