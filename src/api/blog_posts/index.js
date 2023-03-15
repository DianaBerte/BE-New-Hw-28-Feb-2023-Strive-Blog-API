// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getBlogPosts, writeBlogPosts, getBlogPostsJSONReadableStream } from "../../lib/fs-tools.js";
import { Transform } from "@json2csv/node";
import blogPostsModel from "./model.js";
import commentsModel from "../comments/model.js";
import mongoose from "mongoose";

const blogPostsRouter = Express.Router();

// const blogpostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json");
// const getBlogPosts = () => JSON.parse(fs.readFileSync(blogpostsJSONPath));
// const writeBlogPosts = (blogPostsArray) => fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogPostsArray));

//1. POST the old way
// blogPostsRouter.post("/", async (req, res) => {
//   const newBlogPost = {
//     ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date(),
//   };
//   const blogPostsArray = await getBlogPosts();
//   blogPostsArray.push(newBlogPost);
//   writeBlogPosts(blogPostsArray);
//   res.status(201).send({ id: newBlogPost.id });
// });

//1. POST the MONGO way
blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogPostsModel(req.body)
    const { _id } = await newBlogPost.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

//2. GET the old way
// blogPostsRouter.get("/", async (req, res) => {
//   const blogPosts = await getBlogPosts();
//   res.send(blogPosts);
// });

//2. GET the MONGO way
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await blogPostsModel.find()
    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})

//3. GET WITH ID the lod way
// blogPostsRouter.get("/:blogpostId", async (req, res, next) => {
//   try {
//     const blogPostsArray = await getBlogPosts();
//     const foundBlogPost = blogPostsArray.find(
//       (blogPost) => blogPost.id === req.params.blogpostId
//     );
//     if (foundBlogPost) {
//       res.send(foundBlogPost);
//     } else {
//       next(
//         createHttpError(
//           404,
//           `Blog post with id ${req.params.blogpostId} was not found!`
//         )
//       );
//     }
//   } catch (error) {
//     next(error);
//   }
// });

//3. GET WITH ID the MONGO way
blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.blogPostId)
    if (blogPost) {
      res.send(blogPost)
    } else {
      next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

//4. PUT the old way
// blogPostsRouter.put("/:blogpostId", async (req, res, next) => {
//   try {
//     const blogPostsArray = await getBlogPosts();
//     const index = blogPostsArray.findIndex(
//       (blogPost) => blogPost.id === req.params.blogpostId
//     );
//     if (index !== -1) {
//       const oldBlogPost = blogPostsArray[index];
//       const updatedBlogPost = {
//         ...oldBlogPost,
//         ...req.body,
//         updatedAt: new Date(),
//       };
//       blogPostsArray[index] = updatedBlogPost;
//       writeBlogPosts(blogPostsArray);
//       res.send(updatedBlogPost);
//     } else {
//       next(
//         createHttpError(
//           404,
//           `Blog post with id ${req.params.blogpostId} is not found!`
//         )
//       );
//     }
//   } catch (error) {
//     next(error);
//   }
// });

//4. PUT the MONGO way
blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
      req.params.blogPostId,
      req.body,
      { new: true, runValidators: true }
    )
    if (updatedBlogPost) {
      res.send(updatedBlogPost)
    } else {
      next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

//5. DELETE the old way
// blogPostsRouter.delete("/:blogpostId", async (req, res, next) => {
//   try {
//     const blogPostsArray = await getBlogPosts();
//     const remainingBlogPosts = blogPostsArray.filter(
//       (blogPost) => blogPost.id !== req.params.blogpostId
//     );
//     if (blogPostsArray.length !== remainingBlogPosts.length) {
//       writeBlogPosts(remainingBlogPosts);
//       res.status(204).send();
//     } else {
//       next(
//         createHttpError(
//           404,
//           `Blog post with id ${req.params.blogpostId} was not found!`
//         )
//       );
//     }
//   } catch (error) {
//     next(error);
//   }
// });

//5. DELETE the MONGO way
blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await blogPostsModel.findByIdAndDelete(req.params.blogPostId)
    if (deletedBlogPost) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

//endpoint for exporting a CSV file for blog posts
// blogPostsRouter.get("/blogPostsCSV", (req, res, next) => {
//   try {
//     setHeader("Content-Disposition", "attachment; filename=blogPosts.csv")
//     const source = getBlogPostsJSONReadableStream()
//     const transform = new Transform({ fields: ["category", "title", "content", "id"] })
//     const destination = res
//     pipeline(source, transform, destination, err => {
//       if (err) console.log(err)
//     })
//   } catch (error) {
//     next(error)
//   }
// })

// ********************************************** EMBEDDED CRUD **************************************************
//POST /blogPosts/:id
// blogPostsRouter.post("/:blogPostId/comments", async (req, res, next) => {
//   try {
//     const blogPost = await blogPostsModel.findById(req.params.blogPostId);

//     if (!blogPost) {
//       return next(
//         createHttpError(404 `blogpost ${req.params.blogPostId} not found`)
//       )
//     }
//     const newComment = { title: req.body.title, content: req.body.content, createdAt: new Date(), _id: new mongoose.Types.ObjectId(), };
//     blogPost.comments.push(newComment);
//     const { _id } = await blogPost.save();
//     res.status(201).send({ _id })
//   } catch (error) {
//     next(error)
//   }
// })

blogPostsRouter.post("/:blogPostId/comments", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.blogPostId)
    if (blogPost) {
      const newComment = { ...req.body, createdAt: new Date(), updatedAt: new Date() }
      const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      )
      if (updatedBlogPost) {
        res.send(newComment)
      } else {
        next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
      }
    } else {
      next(createHttpError(404, `Comment with id ${req.params.commentId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostId/comments/", async (req, res, next) => {
  try {
    const blogPosts = await blogPostsModel.findById(req.params.blogPostId)
    if (blogPosts) {
      res.send(blogPosts.comments)
    } else {
      next(createHttpError(404, `Comment with id ${req.params.commentId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostId/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogPostsModel.findById(req.params.blogPostId)
    if (blogPost) {
      // console.log("comments:", blogPost.comments)
      const foundComment = blogPost.comments.find(comment => comment._id.toString() === req.params.commentId)
      // console.log("foundComment:", foundComment)
      if (foundComment) {
        res.send(foundComment)
      } else {
        next(createHttpError(404, `Comment with id ${req.params.commentId} not found :(`))
      }
    } else {
      next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostId/comments/:commentId", async (req, res, next) => {
  try {
    const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
      req.params.blogPostId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true, runValidators: true }
    )
    if (updatedBlogPost) {
      res.send(updatedBlogPost)
    } else {
      next(createHttpError(404, `Blog post with id ${req.params.blogPostId} not found :(`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter;
