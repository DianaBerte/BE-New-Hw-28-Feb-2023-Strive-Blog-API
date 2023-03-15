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
blogPostsRouter.post("/:blogPostId/comments", async (req, res, next) => {
  try {
    // We could receive here a blogPostId in the req.body. Given that id, we would like to insert the corresponding comment into the commentsArray of the specified blog post

    // 1. Search in the comments' collection for the comment by id
    const addedComment = await commentsModel.findById(req.body.commentId, { _id: 0 })

    if (addedComment) {
      // 2. If the blog post is found --> let's add additional info like commentDate
      const commentToInsert = { ...addedComment.toObject(), commentDate: new Date() }
      console.log("Comment to insert:", commentToInsert)

      // 3. Update the specified blog post record by adding that comment to the blog post's comments array
      const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
        req.params.blogPostId, //who
        { $push: { comments: commentToInsert } }, //how
        { new: true, runValidators: true } //options
      )
      if (updatedBlogPost) {
        res.send(updatedBlogPost)
      } else {
        next(createHttpError(404, `Blog post with it ${req.params.blogPostId} not found! :(`))
      }
    } else {
      // 4. In case of comment not found  --> 404
      next(createHttpError(404, `Comment with id ${req.body.commentId} not found! :(`))
      console.log("Added comment:", addedComment)
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter;
