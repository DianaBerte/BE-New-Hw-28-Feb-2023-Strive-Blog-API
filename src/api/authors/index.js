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

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", basicAuthenticationMiddleware, async (req, res, next) => {
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
